import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';
import { getProducts } from '@/lib/dataStore';

const OFFLINE_STORAGE_PATH = path.join(process.cwd(), 'lib', 'offline_orders.json');

function getOfflineOrders() {
    try {
        if (fs.existsSync(OFFLINE_STORAGE_PATH)) {
            const data = fs.readFileSync(OFFLINE_STORAGE_PATH, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('Error reading offline orders:', e);
    }
    return [];
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const manufacturerId = searchParams.get('manufacturerId');

        let orders = [];
        let productCount = 0;
        let isOffline = false;

        try {
            await dbConnect();

            if (manufacturerId) {
                // Partner stats: only their products and related orders
                const partnerProducts = await Product.find({ manufacturerId });
                const partnerProductIds = partnerProducts.map(p => p._id.toString());

                productCount = partnerProducts.length;
                orders = await Order.find({ 'items.product': { $in: partnerProductIds } });
            } else {
                // Admin stats: everything
                orders = await Order.find({});
                productCount = await Product.countDocuments();
            }
        } catch (dbError) {
            console.warn('DB Fetch failed for stats, falling back to local');
            const localProducts = getProducts();
            const localOrders = getOfflineOrders();

            if (manufacturerId) {
                const partnerProductIds = localProducts
                    .filter(p => p.manufacturerId === manufacturerId)
                    .map(p => p._id);

                productCount = partnerProductIds.length;
                orders = localOrders.filter((o: any) =>
                    o.items.some((item: any) => partnerProductIds.includes(item.product))
                );
            } else {
                orders = localOrders;
                productCount = localProducts.length;
            }
            isOffline = true;
        }

        // Calculate Stats
        const totalRevenue = orders
            .filter((o: any) => ['shipped', 'delivered', 'confirmed'].includes(o.status))
            .reduce((sum: number, o: any) => {
                if (manufacturerId) {
                    // For partners, only count revenue from THEIR items in the order
                    // Since we don't store manufacturerId in items yet, we have to look up products
                    // or just use totalAmount if we assume 1 vendor per order for now.
                    // To be safe, we'll try to find the products again or use local logic.
                    return sum + (o.totalAmount || 0); // Placeholder: improvement needed for multi-vendor orders
                }
                return sum + (o.totalAmount || 0);
            }, 0);

        const activeOrdersCount = orders.filter((o: any) => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;

        const uniqueCustomers = new Set(orders.map((o: any) => o.customerEmail || o.customerPhone)).size;

        // Recently placed orders (top 5)
        const recentOrders = orders
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((o: any) => ({
                id: o._id,
                customer: o.customerName,
                total: o.totalAmount,
                status: o.status,
                date: o.createdAt
            }));

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue,
                activeOrdersCount,
                totalProducts: productCount,
                totalCustomers: uniqueCustomers,
                recentOrders,
                isOffline
            }
        });
    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
