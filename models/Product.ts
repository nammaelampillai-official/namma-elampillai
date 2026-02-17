import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    images: string[];
    material: string;
    manufacturerId: mongoose.Types.ObjectId;
    isVerified: boolean;
    colors?: string[];
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    material: { type: String, required: true },
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
    isVerified: { type: Boolean, default: false },
    colors: { type: [String], default: [] },
}, { timestamps: true });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
