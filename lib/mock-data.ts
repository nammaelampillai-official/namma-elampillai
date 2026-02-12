export type Manufacturer = {
    _id: string;
    name: string;
    contact: string;
    address: string;
};

export type Product = {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    material: string;
    manufacturerId: string;
    isVerified: boolean;
};

// Mock Database Storage
const MANUFACTURERS: Manufacturer[] = [
    {
        _id: "m1",
        name: "Sri Lakshmi Silks",
        contact: "+91 98765 43210",
        address: "12, Weaver Street, Elampillai"
    },
    {
        _id: "m2",
        name: "Murugan Weaves",
        contact: "+91 91234 56789",
        address: "45, Temple Road, Elampillai"
    }
];

const PRODUCTS: Product[] = [
    {
        _id: "p1",
        name: "Classic Maroon Kanjivaram Style",
        description: "A timeless maroon saree with intricate gold zari body work. Perfect for weddings and grand occasions.",
        price: 2499,
        images: ["/hero-saree.png"],
        material: "Art Silk",
        manufacturerId: "m1",
        isVerified: true
    },
    {
        _id: "p2",
        name: "Peacock Blue Soft Silk",
        description: "Lightweight and elegant soft silk saree in vibrant blue. Easy to drape and comfortable for all-day wear.",
        price: 1899,
        images: ["/hero-saree.png"],
        material: "Soft Silk",
        manufacturerId: "m1",
        isVerified: true
    },
    {
        _id: "p3",
        name: "Traditional Golden Wedding Saree",
        description: "Heavy bridal wear saree with rich pallu designs. The golden sheen adds a royal touch to your special day.",
        price: 4500,
        images: ["/hero-saree.png"],
        material: "Pure Silk Mix",
        manufacturerId: "m2",
        isVerified: true
    },
    {
        _id: "p4",
        name: "Simple Daily Wear Cotton",
        description: "Breathable cotton saree perfect for summer. Elegant designs that are suitable for office and daily use.",
        price: 850,
        images: ["/hero-saree.png"],
        material: "Cotton",
        manufacturerId: "m2",
        isVerified: true
    }
];

// Data Access Layer
export const getProducts = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));
    return PRODUCTS;
};

export const getProductById = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return PRODUCTS.find(p => p._id === id) || null;
};

export const getManufacturers = async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return MANUFACTURERS;
};

export const getManufacturerById = async (id: string) => {
    return MANUFACTURERS.find(m => m._id === id);
}

// Helper to get product with manufacturer details (Admin View)
export const getProductWithManufacturer = async (id: string) => {
    const product = await getProductById(id);
    if (!product) return null;
    const manufacturer = await getManufacturerById(product.manufacturerId);
    return { ...product, manufacturer };
}
