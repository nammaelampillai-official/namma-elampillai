import nodemailer from 'nodemailer';
import { getSiteContentServer } from './server/data';

export async function sendEmail({ subject, html, to }: { subject: string; html: string; to?: string | string[] }) {
    const siteContent = await getSiteContentServer();
    const recipients = to || siteContent.notificationEmails;
    const toList = Array.isArray(recipients) ? recipients.join(', ') : recipients;

    console.log(`[Email] Attempting to send email to: ${toList}`);
    console.log(`[Email] Subject: ${subject}`);

    const gmailPassword = process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD;

    // 1. Check if we have credentials
    if (!process.env.GMAIL_USER || !gmailPassword) {
        console.log('---------------------------------------------------');
        console.warn('⚠️ EMAIL NOT SENT - MISSING CREDENTIALS in process.env');
        console.log(`To: ${toList}`);
        console.log('---------------------------------------------------');
        return { success: true, simulated: true };
    }

    try {
        // Create transporter dynamic to ensure env vars are fresh
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: process.env.GMAIL_USER,
                pass: gmailPassword,
            },
            // Add a timeout to prevent hanging
            connectionTimeout: 10000,
        });

        const info = await transporter.sendMail({
            from: `"Namma Elampillai" <${process.env.GMAIL_USER}>`,
            to: toList,
            subject: subject,
            html: html,
        });

        console.log('[Email] Message sent successfully: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error('[Email] Error sending email:', error.message || error);
        return { success: false, error: error.message || 'Failed to send email' };
    }
}
