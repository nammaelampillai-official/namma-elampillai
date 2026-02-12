// Data Store for managing products and site content
// This uses localStorage for now, can be migrated to MongoDB later

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    material: string;
    manufacturerId: string;
    shopName?: string; // Original shop/manufacturer name
    isVerified: boolean;
    createdAt: string;
}

export interface PageContent {
    id: string;
    title: string;
    content: string;
    lastUpdated: string;
}

export interface HeroSection {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaButtons: {
        primary: { text: string; link: string };
        secondary: { text: string; link: string };
    };
}

export interface FeatureCard {
    id: string;
    icon: string;
    title: string;
    description: string;
}

export interface AboutSection {
    title: string;
    description: string;
    image: string;
    mission: string;
    vision: string;
}

export interface SiteContent {
    hero: HeroSection;
    featureCards: FeatureCard[];
    about: AboutSection;
    elampillai: {
        images: string[];
        description: string;
    };
    footer: {
        address: string;
        mapUrl: string;
        contactEmail: string;
        contactPhone: string;
        heritageText: string;
        quickLinks: { name: string; href: string }[];
        businessLinks: { name: string; href: string }[];
    };
    pages: PageContent[];
    notificationEmails: string[];
    sareeTypes: string[];
    partnerEmails: string[];
    priceRanges: {
        label: string;
        min?: number;
        max?: number;
        image: string;
    }[];
    visualCategories: {
        name: string;
        image: string;
        link: string;
    }[];
    customerStories: {
        id: string;
        name: string;
        content: string;
        image?: string;
        rating: number;
        location?: string;
    }[];
    socialFeed: {
        title: string;
        subtitle: string;
        images: string[];
    };
    youtubeFeed: {
        title: string;
        subtitle: string;
        videos: {
            id: string;
            title: string;
        }[];
    };
    siteName: string;
    logo: string;
    paymentQR: string;
    checkoutSettings: {
        isCodEnabled: boolean;
        freeShippingThreshold: number;
        shippingCharge: number;
        estimatedDeliveryDays: string;
    };
}

// Default site content
export const DEFAULT_SITE_CONTENT: SiteContent = {
    hero: {
        title: "Weaving Heritage",
        subtitle: "Authentic Elampillai silk sarees, woven with passion and tradition. Direct from the loom to your home.",
        backgroundImage: "/hero-saree.png",
        ctaButtons: {
            primary: { text: "Shop Collections", link: "/products" },
            secondary: { text: "Our Story", link: "/about" }
        }
    },
    featureCards: [
        {
            id: "1",
            icon: "sparkles",
            title: "Handwoven Perfection",
            description: "Every thread tells a story of skill passed down through generations."
        },
        {
            id: "2",
            icon: "badge-check",
            title: "Authentic Zari",
            description: "Using only the finest materials to create timeless masterpieces."
        },
        {
            id: "3",
            icon: "users",
            title: "Weaver Direct",
            description: "Empowering local artisans by connecting them directly to you."
        }
    ],
    about: {
        title: "Our Story",
        description: "Namma Elampillai was born from a desire to bring the exquisite craftsmanship of Elampillai weavers to the world. Located in Salem district, Elampillai is renowned for its unique weaving techniques and vibrant silk sarees. For generations, our artisans have been perfecting the art of weaving, creating sarees that are not just garments, but pieces of art.",
        image: "https://placehold.co/800x600/5b21b6/ffffff?text=Weaving+Process",
        mission: "To empower local weavers by providing them a direct platform to showcase their art to the world, ensuring fair prices and sustainable livelihoods.",
        vision: "To make Elampillai Silk a globally recognized brand synonymous with quality, tradition, and ethical fashion."
    },
    elampillai: {
        images: [
            "https://placehold.co/800x600/b45309/ffffff?text=Elampillai+Town+1",
            "https://placehold.co/800x600/b45309/ffffff?text=Elampillai+Town+2"
        ],
        description: "Elampillai is a charming weaving town nestled in the Salem district of Tamil Nadu. Known for its rich textile heritage, the town vibrates with the sound of looms and the colors of fine silk."
    },
    footer: {
        address: "Elampillai, Salem District, Tamil Nadu - 637502",
        mapUrl: "https://www.google.com/maps/place/Elampillai,+Tamil+Nadu/@11.5645,78.0064,15z",
        contactEmail: "info@nammaelampillai.com",
        contactPhone: "+91 98765 43210",
        heritageText: "Connecting the world to the master weavers of Elampillai. Each saree is a piece of living history.",
        quickLinks: [
            { name: 'Returns & Refund Policy', href: '/pages/returns-refund' },
            { name: 'Shipping & Delivery Policy', href: '/pages/shipping-delivery' },
            { name: 'Terms & Conditions', href: '/pages/terms-conditions' },
            { name: 'Privacy Policy', href: '/pages/privacy-policy' },
            { name: 'Blog', href: '/pages/blog' },
        ],
        businessLinks: [
            { name: 'About', href: '/about' },
            { name: 'Contact', href: '/pages/contact' },
            { name: 'FAQ', href: '/pages/faq' },
            { name: 'Compare', href: '/pages/compare' },
        ]
    },
    pages: [
        { id: 'returns-refund', title: 'Returns & Refund Policy', content: 'Detailed returns and refund policy content...', lastUpdated: new Date().toISOString() },
        { id: 'shipping-delivery', title: 'Shipping & Delivery Policy', content: 'Detailed shipping and delivery policy content...', lastUpdated: new Date().toISOString() },
        { id: 'terms-conditions', title: 'Terms & Conditions', content: 'Our terms and conditions...', lastUpdated: new Date().toISOString() },
        { id: 'privacy-policy', title: 'Privacy Policy', content: 'Our privacy policy...', lastUpdated: new Date().toISOString() },
        { id: 'blog', title: 'Blog', content: 'Welcome to our blog. Here we share stories about the heritage of Elampillai sarees.', lastUpdated: new Date().toISOString() },
        { id: 'faq', title: 'FAQ', content: 'Frequently asked questions...', lastUpdated: new Date().toISOString() },
        { id: 'compare', title: 'Compare', content: 'Compare our saree fabrics and qualities...', lastUpdated: new Date().toISOString() },
        { id: 'contact', title: 'Contact Us', content: 'Get in touch with us for bulk orders or enquiries.', lastUpdated: new Date().toISOString() }
    ],
    notificationEmails: [
        'info.nammaelampillai@gmail.com',
        'ragavan.aero27@gmail.com'
    ],
    sareeTypes: [
        'Pure Silk',
        'Art Silk',
        'Soft Silk',
        'Cotton',
        'Cotton Mix',
        'Marriage Silk',
        'Fancy Silk',
        'Tissue Silk'
    ],
    partnerEmails: [
        'partner@namma.com'
    ],
    priceRanges: [
        { label: 'Under ₹2000', max: 2000, image: '/saree-1.jpg' },
        { label: '₹2000 - ₹5000', min: 2000, max: 5000, image: '/saree-2.jpg' },
        { label: '₹5000 - ₹10000', min: 5000, max: 10000, image: '/saree-3.jpg' },
        { label: 'Above ₹10000', min: 10000, image: '/saree-4.jpg' }
    ],
    visualCategories: [
        { name: 'Pure Silk', image: '/saree-1.jpg', link: '/products?material=Pure Silk' },
        { name: 'Art Silk', image: '/saree-2.jpg', link: '/products?material=Art Silk' },
        { name: 'Soft Silk', image: '/saree-3.jpg', link: '/products?material=Soft Silk' },
        { name: 'Cotton', image: '/saree-4.jpg', link: '/products?material=Cotton' }
    ],
    customerStories: [
        {
            id: '1',
            name: 'Priya Sharma',
            content: 'The quality of the silk is exceptional. I wore it for a wedding and received so many compliments!',
            rating: 5,
            location: 'Chennai'
        },
        {
            id: '2',
            name: 'Lakshmi Ramaswamy',
            content: 'Authentic Elampillai sarees. The handloom work is visible in every thread. Highly recommended.',
            rating: 5,
            location: 'Bangalore'
        }
    ],
    socialFeed: {
        title: 'Connect With Us',
        subtitle: 'Follow our journey on Instagram @NammaElampillai',
        images: ['/saree-1.jpg', '/saree-2.jpg', '/saree-3.jpg', '/saree-4.jpg']
    },
    youtubeFeed: {
        title: "Latest Collections on YouTube",
        subtitle: "Watch our weavers in action and explore our newest saree collections through video.",
        videos: [
            { id: "dQw4w9WgXcQ", title: "Pure Silk Saree Collection 2025" },
            { id: "dQw4w9WgXcQ", title: "The Art of Elampillai Weaving" }
        ]
    },
    siteName: "Namma Elampillai",
    logo: "",
    paymentQR: "/gpay-qr.png",
    checkoutSettings: {
        isCodEnabled: true,
        freeShippingThreshold: 2000,
        shippingCharge: 100,
        estimatedDeliveryDays: '5-7 Days'
    }
};

export const PARTNER_MAPPINGS: Record<string, string> = {
    'partner@namma.com': 'mock_id_1'
};

// Default products
const DEFAULT_PRODUCTS: Product[] = [
    {
        _id: '1',
        name: 'Royal Blue Elampillai Silk',
        description: 'Exquisite handwoven silk saree with traditional peacock motifs in gold zari. Perfect for weddings and special occasions.',
        price: 4500,
        images: ['/images/saree-royal-blue.png'],
        material: 'Pure Silk',
        manufacturerId: 'mock_id_1',
        shopName: 'Heritage Weaves',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        name: 'Crimson Art Silk Saree',
        description: 'Lightweight and durable art silk saree with geometric patterns. A perfect blend of tradition and modern comfort.',
        price: 2800,
        images: ['/images/saree-crimson-art.png'],
        material: 'Art Silk',
        manufacturerId: 'mock_id_2',
        shopName: 'Silk Roots',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '3',
        name: 'Emerald Green Cotton Mix',
        description: 'Breathable cotton mix saree ideal for daily wear. Features a subtle golden border.',
        price: 1200,
        images: ['https://placehold.co/400x600/064e3b/ffffff?text=Emerald+Green'],
        material: 'Cotton Mix',
        manufacturerId: 'mock_id_3',
        shopName: 'Green Looms',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '4',
        name: 'Golden Tissue Saree',
        description: 'Grand tissue saree that shimmers in the light. Handcrafted for the festive season.',
        price: 5500,
        images: ['https://placehold.co/400x600/d97706/ffffff?text=Golden+Tissue'],
        material: 'Pure Silk',
        manufacturerId: 'mock_id_4',
        shopName: 'Golden Thread',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '5',
        name: 'Magenta Soft Silk',
        description: 'Buttery soft silk saree in a vibrant magenta shade. Known for its comfort and elegance.',
        price: 3800,
        images: ['https://placehold.co/400x600/be185d/ffffff?text=Magenta+Soft+Silk'],
        material: 'Soft Silk',
        manufacturerId: 'mock_id_5',
        shopName: 'Soft Silks Elampillai',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '6',
        name: 'Peacock Green Marriage Silk',
        description: 'Heavy bridal collection saree with intricate full-body zari work. A masterpiece of Elampillai craftsmanship.',
        price: 8500,
        images: ['https://placehold.co/400x600/115e59/ffffff?text=Bridal+Silk'],
        material: 'Marriage Silk',
        manufacturerId: 'mock_id_6',
        shopName: 'Bridal Weaves',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '7',
        name: 'Mustard Yellow Cotton Saree',
        description: 'Classic mustard yellow cotton saree with maroon temple border. Cool and comfortable for summer.',
        price: 950,
        images: ['https://placehold.co/400x600/a16207/ffffff?text=Mustard+Cotton'],
        material: 'Cotton',
        manufacturerId: 'mock_id_7',
        shopName: 'Yellow Looms',
        isVerified: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: '8',
        name: 'Violet Fancy Saree',
        description: 'Contemporary design on traditional loom. Violet body with silver zari floral creepers.',
        price: 3200,
        images: ['https://placehold.co/400x600/5b21b6/ffffff?text=Violet+Fancy'],
        material: 'Fancy Silk',
        manufacturerId: 'mock_id_8',
        shopName: 'Fancy Threads',
        isVerified: true,
        createdAt: new Date().toISOString()
    }
];

// Storage keys
const STORAGE_KEYS = {
    PRODUCTS: 'namma_elampillai_products',
    SITE_CONTENT: 'namma_elampillai_site_content',
    MEDIA_LIBRARY: 'namma_elampillai_media',
    USERS: 'namma_elampillai_users'
};

// Initialize data if not exists
export function initializeData() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }

    const savedContent = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    if (!savedContent) {
        localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
    } else {
        // Migration: Merge new fields into existing content
        try {
            const currentContent = JSON.parse(savedContent);
            const mergedContent = { ...DEFAULT_SITE_CONTENT, ...currentContent };

            // Specifically ensure nested objects are merged or present
            if (!currentContent.elampillai) mergedContent.elampillai = DEFAULT_SITE_CONTENT.elampillai;
            if (!currentContent.footer) {
                mergedContent.footer = DEFAULT_SITE_CONTENT.footer;
            } else {
                // Merge individual footer fields
                mergedContent.footer = { ...DEFAULT_SITE_CONTENT.footer, ...currentContent.footer };
            }
            if (!currentContent.pages) mergedContent.pages = DEFAULT_SITE_CONTENT.pages;
            if (!currentContent.notificationEmails) mergedContent.notificationEmails = DEFAULT_SITE_CONTENT.notificationEmails;
            if (!currentContent.sareeTypes) mergedContent.sareeTypes = DEFAULT_SITE_CONTENT.sareeTypes;
            if (!currentContent.partnerEmails) mergedContent.partnerEmails = DEFAULT_SITE_CONTENT.partnerEmails;
            if (!currentContent.priceRanges) mergedContent.priceRanges = DEFAULT_SITE_CONTENT.priceRanges;
            if (!currentContent.visualCategories) mergedContent.visualCategories = DEFAULT_SITE_CONTENT.visualCategories;
            if (!currentContent.customerStories) mergedContent.customerStories = DEFAULT_SITE_CONTENT.customerStories;
            if (!currentContent.socialFeed) mergedContent.socialFeed = DEFAULT_SITE_CONTENT.socialFeed;
            if (!currentContent.youtubeFeed) mergedContent.youtubeFeed = DEFAULT_SITE_CONTENT.youtubeFeed;

            localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(mergedContent));
        } catch (e) {
            console.error("Failed to migrate site content", e);
            localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(DEFAULT_SITE_CONTENT));
        }
    }

    if (!localStorage.getItem(STORAGE_KEYS.MEDIA_LIBRARY)) {
        localStorage.setItem(STORAGE_KEYS.MEDIA_LIBRARY, JSON.stringify([]));
    }
}

// Products
export function getProducts(): Product[] {
    if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
}

export function getProductById(id: string): Product | null {
    const products = getProducts();
    return products.find(p => p._id === id) || null;
}

export function saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

// Pages
export function getPageById(id: string): PageContent | null {
    const content = getSiteContent();
    return content.pages.find(p => p.id === id) || null;
}

export function updatePage(id: string, updates: Partial<PageContent>): void {
    const content = getSiteContent();
    const index = content.pages.findIndex(p => p.id === id);
    if (index !== -1) {
        content.pages[index] = { ...content.pages[index], ...updates, lastUpdated: new Date().toISOString() };
        saveSiteContent(content);
    }
}

export function addProduct(product: Omit<Product, '_id' | 'createdAt'>): Product {
    const products = getProducts();
    const newProduct: Product = {
        ...product,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = getProducts();
    const index = products.findIndex(p => p._id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
}

export function deleteProduct(id: string): boolean {
    const products = getProducts();
    const filtered = products.filter(p => p._id !== id);
    if (filtered.length === products.length) return false;
    saveProducts(filtered);
    return true;
}

// Site Content
export function getSiteContent(): SiteContent {
    if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    return data ? JSON.parse(data) : DEFAULT_SITE_CONTENT;
}

export function saveSiteContent(content: SiteContent): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
}

// Media Library
export interface MediaFile {
    id: string;
    filename: string;
    path: string;
    size: number;
    uploadedAt: string;
}

export function getMediaLibrary(): MediaFile[] {
    if (typeof window === 'undefined') return [];
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.MEDIA_LIBRARY);
    return data ? JSON.parse(data) : [];
}

export function addMediaFile(file: Omit<MediaFile, 'id' | 'uploadedAt'>): MediaFile {
    const media = getMediaLibrary();
    const newFile: MediaFile = {
        ...file,
        id: Date.now().toString(),
        uploadedAt: new Date().toISOString()
    };
    media.push(newFile);
    localStorage.setItem(STORAGE_KEYS.MEDIA_LIBRARY, JSON.stringify(media));
    return newFile;
}

export function deleteMediaFile(id: string): boolean {
    const media = getMediaLibrary();
    const filtered = media.filter(m => m.id !== id);
    if (filtered.length === media.length) return false;
    localStorage.setItem(STORAGE_KEYS.MEDIA_LIBRARY, JSON.stringify(filtered));
    return true;
}

// User Management
export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Stored in plain text for this local demo (use hash in production)
    role: 'customer' | 'admin';
    createdAt: string;
}

export function getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    initializeData();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
}

export function addUser(user: Omit<User, 'id' | 'createdAt' | 'role'>): User {
    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
        throw new Error('Email already registered');
    }

    const newUser: User = {
        ...user,
        id: Date.now().toString(),
        role: 'customer',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
}

export function findUser(email: string): User | null {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
}
