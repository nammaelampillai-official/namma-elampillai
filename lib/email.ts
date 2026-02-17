import nodemailer from 'nodemailer';
import { getSiteContentServer } from './server/data';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function sendEmail({ subject, html, to }: { subject: string; html: string; to?: string | string[] }) {
    const siteContent = await getSiteContentServer();
    const recipients = to || siteContent.notificationEmails;
    const toList = Array.isArray(recipients) ? recipients.join(', ') : recipients;

    // 1. Check if we have credentials
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.log('---------------------------------------------------');
        console.warn('⚠️ EMAIL NOT SENT - MISSING CREDENTIALS');
        console.log(`To: ${toList}`);
        console.log(`Subject: ${subject}`);
        console.log('Body Preview:', html.substring(0, 100) + '...');
        console.log('---------------------------------------------------');
        return { success: true, simulated: true };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Namma Elampillai Admin" <${process.env.GMAIL_USER}>`,
            to: toList,
            subject: subject,
            html: html,
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
