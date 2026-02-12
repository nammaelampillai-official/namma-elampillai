import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISiteContent extends Document {
    hero: any;
    featureCards: any[];
    about: any;
    elampillai: any;
    footer: any;
    pages: any[];
    notificationEmails: string[];
    sareeTypes: string[];
    partnerEmails: string[];
    priceRanges: any[];
    visualCategories: any[];
    customerStories: any[];
    socialFeed: any;
    youtubeFeed: any;
    siteName: string;
    logo: string;
    paymentQR?: string;
    checkoutSettings: {
        isCodEnabled: boolean;
        freeShippingThreshold: number;
        shippingCharge: number;
        estimatedDeliveryDays: string;
    };
}

const SiteContentSchema: Schema = new Schema({
    hero: { type: Object, required: true },
    featureCards: { type: Array, required: true },
    about: { type: Object, required: true },
    elampillai: { type: Object, required: true },
    footer: { type: Object, required: true },
    pages: { type: Array, required: true },
    notificationEmails: { type: [String], required: true },
    sareeTypes: { type: [String], required: true },
    partnerEmails: { type: [String], required: true },
    priceRanges: { type: Array, required: true },
    visualCategories: { type: Array, required: true },
    customerStories: { type: Array, required: true },
    socialFeed: { type: Object, required: true },
    youtubeFeed: { type: Object, required: true },
    siteName: { type: String, required: true },
    logo: { type: String, required: true },
    paymentQR: { type: String, default: '/gpay-qr.png' },
    checkoutSettings: {
        type: {
            isCodEnabled: { type: Boolean, default: true },
            freeShippingThreshold: { type: Number, default: 2000 },
            shippingCharge: { type: Number, default: 100 },
            estimatedDeliveryDays: { type: String, default: '5-7 Days' }
        },
        default: {
            isCodEnabled: true,
            freeShippingThreshold: 2000,
            shippingCharge: 100,
            estimatedDeliveryDays: '5-7 Days'
        }
    }
}, { timestamps: true });

const SiteContent: Model<ISiteContent> = mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);

export default SiteContent;
