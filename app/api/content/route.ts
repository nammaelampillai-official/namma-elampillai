import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import { DEFAULT_SITE_CONTENT } from '@/lib/dataStore';

export async function GET() {
    try {
        await dbConnect();
        const content = await SiteContent.findOne().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: content || DEFAULT_SITE_CONTENT });
    } catch (error: any) {
        console.error('Error fetching site content:', error);
        return NextResponse.json({ success: true, data: DEFAULT_SITE_CONTENT });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        let content = await SiteContent.findOne().sort({ createdAt: -1 });

        if (content) {
            Object.assign(content, body);
            await content.save();
        } else {
            content = await SiteContent.create(body);
        }

        return NextResponse.json({ success: true, data: content });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
