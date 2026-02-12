import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import Product from '@/models/Product';
import { DEFAULT_SITE_CONTENT } from '@/lib/dataStore';

export async function getSiteContentServer() {
    try {
        await dbConnect();
        const content = await SiteContent.findOne().sort({ createdAt: -1 });
        return content ? JSON.parse(JSON.stringify(content)) : DEFAULT_SITE_CONTENT;
    } catch (error) {
        console.error('Error fetching site content:', error);
        return DEFAULT_SITE_CONTENT;
    }
}

export async function getProductsServer() {
    try {
        await dbConnect();
        const products = await Product.find({ isVerified: true }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(products));
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}
