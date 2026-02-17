import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
    // List all keys to check for typos (e.g. "GMAIL_USER ")
    const allEnvKeys = Object.keys(process.env);

    const diagnostics = {
        hasUser: !!process.env.GMAIL_USER,
        hasPass: !!process.env.GMAIL_APP_PASSWORD,
        user: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.substring(0, 3)}...` : 'not set',
        passLength: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0,
        availableKeys: allEnvKeys.filter(key => key.includes('GMAIL') || key.includes('NEXT_PUBLIC') || key.includes('MONGO')),
    };

    try {
        console.log('[TestEmail] Starting diagnostic test...');
        const result = await sendEmail({
            subject: '🔍 Test Email Notification - Namma Elampillai',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h2>Diagnostics Test</h2>
                    <p>This is a test email sent from the Namma Elampillai diagnostic route.</p>
                    <ul>
                        <li><strong>Time:</strong> ${new Date().toISOString()}</li>
                        <li><strong>Server Env:</strong> Vercel/Node.js</li>
                    </ul>
                </div>
            `
        });

        return NextResponse.json({
            success: true,
            diagnostics,
            emailResult: result
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            diagnostics,
            error: error.message || 'Unknown error during test'
        }, { status: 500 });
    }
}
