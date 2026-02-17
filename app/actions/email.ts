'use server';

import { sendEmail } from '@/lib/email';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderDetails {
    orderId: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    shippingAddress: string;
}

export async function sendOrderNotification(order: OrderDetails) {
    const itemList = order.items.map(item =>
        `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`
    ).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #800020; border-bottom: 2px solid #daa520; padding-bottom: 10px;">New Order Received! 🎉</h1>
            <p><strong>Order ID:</strong> #${order.orderId}</p>
            <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            
            <h3 style="color: #800020;">Items:</h3>
            <ul>
                ${itemList}
            </ul>
            
            <p style="font-size: 1.2em;"><strong>Total Amount: ₹${order.total}</strong></p>
            
            <h3 style="color: #800020;">Shipping Address:</h3>
            <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #daa520;">
                ${order.shippingAddress.replace(/\n/g, '<br>')}
            </p>
        </div>
    `;

    return await sendEmail({
        subject: `New Order #${order.orderId} from ${order.customerName}`,
        html
    });
}

export async function sendLoginNotification(email: string) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #800020;">Admin Login Alert 🔐</h2>
            <p>A login was detected on the Admin Panel.</p>
            
            <div style="background: #fff0f0; border: 1px solid #ffcccc; padding: 15px; border-radius: 5px;">
                <p><strong>User:</strong> ${email}</p>
                <p><strong>Time:</strong> ${timestamp}</p>
            </div>
            
            <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
                If this wasn't you, please change your password immediately.
            </p>
        </div>
    `;

    return await sendEmail({
        subject: `Security Alert: Admin Login - ${email}`,
        html
    });
}

export async function sendSignupNotification(name: string, email: string) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #800020;">New Customer Registration 🎉</h2>
            <p>A new customer has created an account on Namma Elampillai.</p>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 5px;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Time:</strong> ${timestamp}</p>
            </div>
        </div>
    `;

    return await sendEmail({
        subject: `New Customer: ${name}`,
        html
    });
}

export async function sendEnquiryNotification(data: { name: string; email: string; phone: string; message: string }) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #800020; border-bottom: 2px solid #daa520; padding-bottom: 10px;">New Enquiry Received! 📩</h2>
            <div style="background: #fdfaf0; border: 1px solid #f3e8b0; padding: 20px; border-radius: 10px; margin-top: 20px;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Time:</strong> ${timestamp}</p>
                <hr style="border: none; border-top: 1px solid #f3e8b0; margin: 15px 0;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="font-size: 0.9em; color: #666; margin-top: 20px; text-align: center;">
                Reply directly to this email to contact the customer.
            </p>
        </div>
    `;

    return await sendEmail({
        subject: `New Enquiry from ${data.name}`,
        html
    });
}

export async function sendOrderStatusUpdate(orderId: string, customerName: string, customerEmail: string, newStatus: string) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    let statusTitle = "Order Update";
    let statusMessage = `Your order #${orderId.slice(-6).toUpperCase()} status has been updated to ${newStatus}.`;
    let icon = "📦";

    switch (newStatus) {
        case 'confirmed':
            statusTitle = "Order Confirmed! ✅";
            statusMessage = "Good news! Your order has been confirmed and is being processed.";
            icon = "✅";
            break;
        case 'shipped':
            statusTitle = "Order Shipped! 🚚";
            statusMessage = "Exciting news! Your beautiful Elampillai saree has been shipped and is on its way to you.";
            icon = "🚚";
            break;
        case 'delivered':
            statusTitle = "Order Delivered! 🎁";
            statusMessage = "Your order has been marked as delivered. We hope you love your new saree!";
            icon = "🎁";
            break;
        case 'cancelled':
            statusTitle = "Order Cancelled ❌";
            statusMessage = "Your order has been cancelled. If you have any questions, please contact our support.";
            icon = "❌";
            break;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://namma-elampillai.vercel.app';
    const orderUrl = `${appUrl}/orders`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #f0f0f0; border-radius: 10px; overflow: hidden;">
            <div style="background: #800020; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-family: serif;">Namma Elampillai</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.8; letter-spacing: 2px;">WEAVING HERITAGE</p>
            </div>
            
            <div style="padding: 40px 30px; line-height: 1.6;">
                <h2 style="color: #800020; text-align: center; font-size: 24px;">${statusTitle}</h2>
                <div style="text-align: center; font-size: 50px; margin: 20px 0;">${icon}</div>
                
                <p>Dear <strong>${customerName}</strong>,</p>
                <p>${statusMessage}</p>
                
                <div style="background: #fdfaf0; border: 1px solid #f3e8b0; padding: 20px; border-radius: 10px; margin: 30px 0;">
                    <p style="margin: 0;"><strong>Order ID:</strong> #${orderId.slice(-6).toUpperCase()}</p>
                    <p style="margin: 5px 0 0 0;"><strong>Status:</strong> <span style="color: #800020; font-weight: bold; text-transform: uppercase;">${newStatus}</span></p>
                    <p style="margin: 5px 0 0 0;"><strong>Updated At:</strong> ${timestamp}</p>
                </div>
                
                <p>You can track your order in your dashboard or contact us if you have any questions.</p>
                
                <div style="text-align: center; margin-top: 40px;">
                    <a href="${orderUrl}" style="background: #800020; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Order Status</a >
    </div>
    </div>

    < div style = "background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;" >
        <p>© 2025 Namma Elampillai - Authentic Handwoven Sarees </p>
            < p > Elampillai, Salem District, Tamil Nadu </p>
                </div>
                </div>
                    `;

    return await sendEmail({
        to: customerEmail,
        subject: `Update on your Order #${orderId.slice(-6).toUpperCase()} - ${newStatus.toUpperCase()} `,
        html
    });
}
