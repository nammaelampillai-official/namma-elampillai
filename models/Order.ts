import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IOrder extends Document {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    items: {
        product: string;
        quantity: number;
        priceAtPurchase: number;
    }[];
    totalAmount: number;
    paymentMethod: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    address: { type: String, required: true },
    items: [{
        product: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        priceAtPurchase: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
