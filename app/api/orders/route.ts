import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import fs from 'fs';
import path from 'path';
import { sendOrderNotification } from '@/app/actions/email';

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

function saveOfflineOrder(order: any) {
    try {
        const orders = getOfflineOrders();
        orders.unshift({
            ...order,
            _id: `offline_${Date.now()}`,
            createdAt: new Date().toISOString()
        });
        fs.writeFileSync(OFFLINE_STORAGE_PATH, JSON.stringify(orders, null, 2));
    } catch (e) {
        console.error('Error saving offline order:', e);
    }
}

import Product from '@/models/Product';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const manufacturerId = searchParams.get('manufacturerId');

        let query = {};
        if (manufacturerId) {
            // Find all products by this manufacturer
            const partnerProducts = await Product.find({ manufacturerId }).select('_id');
            const productIds = partnerProducts.map(p => p._id.toString());

            // Find orders containing these products
            query = { 'items.product': { $in: productIds } };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: orders });
    } catch (error: any) {
        console.warn('DB Fetch failed for orders, falling back to offline storage');
        const { searchParams } = new URL(request.url);
        const manufacturerId = searchParams.get('manufacturerId');

        let offlineOrders = getOfflineOrders();

        if (manufacturerId) {
            // In offline mode, products are also mock/local. 
            // We'll rely on our getProducts() helper to find which products belong to this partner
            const { getProducts } = require('@/lib/dataStore');
            const partnerProductIds = getProducts()
                .filter((p: any) => p.manufacturerId === manufacturerId)
                .map((p: any) => p._id);

            offlineOrders = offlineOrders.filter((o: any) =>
                o.items.some((item: any) => partnerProductIds.includes(item.product))
            );
        }

        return NextResponse.json({ success: true, data: offlineOrders, note: 'Loaded from local storage' });
    }
}

export async function POST(request: Request) {
    console.log('--- POST /api/orders ---');
    try {
        let body;
        try {
            body = await request.json();
            console.log('Request Body:', JSON.stringify(body, null, 2));
        } catch (e) {
            return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
        }

        // Validate required fields explicitly
        const required = ['customerName', 'customerPhone', 'items', 'total', 'paymentMethod'];
        const missing = required.filter(field => !body[field]);

        if (missing.length > 0 || !body.items.length) {
            console.error('Validation Failed:', { missing, itemsCount: body.items?.length });
            return NextResponse.json({
                success: false,
                error: `Missing required fields: ${missing.join(', ')} or empty items`
            }, { status: 400 });
        }

        const orderData = {
            customerName: body.customerName,
            customerEmail: body.customerEmail || '',
            customerPhone: body.customerPhone,
            address: body.shippingAddress || body.address || 'No Address Provided',
            items: body.items.map((item: any) => ({
                product: item.id || item._id,
                quantity: Number(item.quantity) || 1,
                priceAtPurchase: Number(item.price) || 0
            })),
            totalAmount: Number(body.total) || 0,
            paymentMethod: body.paymentMethod,
            status: 'pending'
        };

        try {
            await dbConnect();
            console.log('Creating Order with data:', JSON.stringify(orderData, null, 2));
            const order = await Order.create(orderData);
            console.log('Order created successfully:', order._id);

            // Send email notification from server
            try {
                const orderNotificationData = {
                    orderId: order._id.toString(),
                    customerName: order.customerName,
                    customerEmail: order.customerEmail,
                    items: body.items,
                    total: order.totalAmount,
                    paymentMethod: order.paymentMethod,
                    shippingAddress: order.address
                };

                // Send to Admin
                await sendOrderNotification(orderNotificationData);

                // Send to Customer
                if (order.customerEmail) {
                    await sendOrderConfirmationToCustomer(orderNotificationData);
                }
            } catch (emailErr) {
                console.error('Failed to send order email notices:', emailErr);
            }

            return NextResponse.json({
                success: true,
                data: JSON.parse(JSON.stringify(order))
            });
        } catch (dbError: any) {
            console.error('Database/Connection Error during order creation, saving locally:', dbError);
            saveOfflineOrder(orderData);

            // Even for offline/local storage orders, try to send the email alert
            try {
                const offlineNotificationData = {
                    orderId: `OFFLINE_${Date.now().toString().slice(-4)}`,
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    items: body.items,
                    total: orderData.totalAmount,
                    paymentMethod: orderData.paymentMethod,
                    shippingAddress: orderData.address
                };

                // Send to Admin
                await sendOrderNotification(offlineNotificationData);

                // Send to Customer
                if (orderData.customerEmail) {
                    await sendOrderConfirmationToCustomer(offlineNotificationData);
                }
            } catch (emailErr) {
                console.error('Failed to send offline order email notices:', emailErr);
            }

            return NextResponse.json({
                success: true,
                data: { ...orderData, _id: `temp_${Date.now()}`, note: 'Order saved to local storage' }
            });
        }
    } catch (error: any) {
        console.error('CRITICAL Order API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}

import { sendOrderStatusUpdate, sendOrderConfirmationToCustomer } from '@/app/actions/email';

export async function PATCH(request: Request) {
    console.log('--- PATCH /api/orders ---');
    try {
        const { orderId, status } = await request.json();

        if (!orderId || !status) {
            return NextResponse.json({ success: false, error: 'Order ID and Status required' }, { status: 400 });
        }

        let updatedOrder = null;

        try {
            await dbConnect();
            updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        } catch (dbError) {
            console.warn('DB Update failed, looking for offline order');
        }

        if (!updatedOrder) {
            // Offline storage fallback
            const orders = getOfflineOrders();
            const index = orders.findIndex((o: any) => o._id === orderId);

            if (index !== -1) {
                orders[index].status = status;
                fs.writeFileSync(OFFLINE_STORAGE_PATH, JSON.stringify(orders, null, 2));
                updatedOrder = orders[index];
            }
        }

        if (updatedOrder) {
            // Send status update email at the end (don't await to avoid blocking response)
            sendOrderStatusUpdate(
                updatedOrder._id,
                updatedOrder.customerName,
                updatedOrder.customerEmail,
                status
            ).catch(err => console.error('Failed to send status email:', err));

            return NextResponse.json({ success: true, data: updatedOrder });
        }

        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    } catch (error: any) {
        console.error('PATCH Order API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
