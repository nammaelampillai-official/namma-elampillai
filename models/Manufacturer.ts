import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IManufacturer extends Document {
    name: string;
    contact: string;
    address: string;
    createdAt: Date;
}

const ManufacturerSchema: Schema = new Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
}, { timestamps: true });

// Check if model exists to prevent overwrite in hot-reload
const Manufacturer: Model<IManufacturer> = mongoose.models.Manufacturer || mongoose.model<IManufacturer>('Manufacturer', ManufacturerSchema);

export default Manufacturer;
