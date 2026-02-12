const mongoose = require('mongoose');

// Load env vars if using node --env-file (Node 20+) or similar
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/namma-elampillai';

const ManufacturerSchema = new mongoose.Schema({
    name: String,
    contact: String,
    address: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [String],
    material: String,
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer' },
    isVerified: Boolean,
}, { timestamps: true });

const Manufacturer = mongoose.models.Manufacturer || mongoose.model('Manufacturer', ManufacturerSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Manufacturer.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create Manufacturers
    const man1 = await Manufacturer.create({
        name: "Sri Lakshmi Silks",
        contact: "+91 98765 43210",
        address: "12, Weaver Street, Elampillai"
    });

    const man2 = await Manufacturer.create({
        name: "Murugan Weaves",
        contact: "+91 91234 56789",
        address: "45, Temple Road, Elampillai"
    });

    console.log('Created Manufacturers');

    // Create Products
    const products = [
        {
            name: "Classic Maroon Kanjivaram Style",
            description: "A timeless maroon saree with intricate gold zari body work.",
            price: 2499,
            images: ["/hero-saree.png"],
            material: "Art Silk",
            manufacturerId: man1._id,
            isVerified: true
        },
        {
            name: "Peacock Blue Soft Silk",
            description: "Lightweight and elegant soft silk saree in vibrant blue.",
            price: 1899,
            images: ["/hero-saree.png"], // Placeholder image for now
            material: "Soft Silk",
            manufacturerId: man1._id,
            isVerified: true
        },
        {
            name: "Traditional Golden Wedding Saree",
            description: "Heavy bridal wear saree with rich pallu designs.",
            price: 4500,
            images: ["/hero-saree.png"],
            material: "Pure Silk Mix",
            manufacturerId: man2._id,
            isVerified: true
        },
        {
            name: "Simple Daily Wear Cotton",
            description: "Breathable cotton saree perfect for summer.",
            price: 850,
            images: ["/hero-saree.png"],
            material: "Cotton",
            manufacturerId: man2._id,
            isVerified: true
        }
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} Products`);

    await mongoose.disconnect();
    console.log('Done!');
}

seed().catch(console.error);
