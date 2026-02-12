'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ShoppingCart, Truck, CreditCard, Save } from 'lucide-react';
import { getSiteContent } from '@/lib/dataStore';

export default function CheckoutSettingsPage() {
    const [content, setContent] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    setContent(result.data);
                } else {
                    setContent(getSiteContent());
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                setContent(getSiteContent());
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            const result = await res.json();
            if (result.success) {
                alert('Checkout settings updated successfully!');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (!content) return <div className="p-8 text-gray-500 italic text-center">Loading settings...</div>;

    const updateSettings = (field: string, value: any) => {
        setContent({
            ...content,
            checkoutSettings: {
                ...content.checkoutSettings,
                [field]: value
            }
        });
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-heritage-maroon">Checkout & Cart Settings</h1>
                <p className="text-gray-500 italic">Manage payment options, shipping charges, and cart behavior</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Options */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-heritage-maroon" />
                        Payment Methods
                    </h2>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                            <p className="font-bold text-gray-900">Enable Cash on Delivery (COD)</p>
                            <p className="text-sm text-gray-500">Allow customers to pay when they receive the product</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={content.checkoutSettings.isCodEnabled}
                                onChange={(e) => updateSettings('isCodEnabled', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-heritage-maroon/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-heritage-maroon"></div>
                        </label>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex gap-3">
                        <span className="text-lg">ℹ️</span>
                        <p>Online payments are always enabled via your GPay/UPI QR code. COD can be turned off if you prefer only prepaid orders.</p>
                    </div>
                </div>

                {/* Shipping & Delivery */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-heritage-maroon" />
                        Shipping & Delivery
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="shippingCharge">Standard Shipping Charge (₹)</Label>
                            <Input
                                id="shippingCharge"
                                type="number"
                                value={content.checkoutSettings.shippingCharge}
                                onChange={(e) => updateSettings('shippingCharge', parseInt(e.target.value))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
                            <Input
                                id="freeShippingThreshold"
                                type="number"
                                value={content.checkoutSettings.freeShippingThreshold}
                                onChange={(e) => updateSettings('freeShippingThreshold', parseInt(e.target.value))}
                            />
                            <p className="text-xs text-gray-400">Set to 0 to always offer free shipping</p>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="estimatedDelivery">Estimated Delivery Text</Label>
                            <Input
                                id="estimatedDelivery"
                                placeholder="e.g. 5-7 Working Days"
                                value={content.checkoutSettings.estimatedDeliveryDays}
                                onChange={(e) => updateSettings('estimatedDeliveryDays', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="gap-2 px-8">
                        {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
                    </Button>
                </div>
            </form>
        </div>
    );
}
