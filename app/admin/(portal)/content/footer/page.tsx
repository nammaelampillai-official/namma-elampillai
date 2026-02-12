'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { getSiteContent, saveSiteContent, type SiteContent } from '@/lib/dataStore';
import { Save, Eye, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function FooterAdminPage() {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    setContent(result.data);
                } else {
                    setContent(getSiteContent());
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                setContent(getSiteContent());
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content) return;

        setLoading(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            const result = await res.json();
            if (result.success) {
                saveSiteContent(content);
                alert('Footer content updated successfully!');
            } else {
                throw new Error(result.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Failed to save content');
        } finally {
            setLoading(false);
        }
    };

    const addLink = (type: 'quickLinks' | 'businessLinks') => {
        if (!content) return;
        const newLinks = [...content.footer[type], { name: 'New Link', href: '/pages/' }];
        setContent({
            ...content,
            footer: { ...content.footer, [type]: newLinks }
        });
    };

    const removeLink = (type: 'quickLinks' | 'businessLinks', index: number) => {
        if (!content) return;
        const newLinks = content.footer[type].filter((_, i) => i !== index);
        setContent({
            ...content,
            footer: { ...content.footer, [type]: newLinks }
        });
    };

    const updateLink = (type: 'quickLinks' | 'businessLinks', index: number, field: 'name' | 'href', value: string) => {
        if (!content) return;
        const newLinks = [...content.footer[type]];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setContent({
            ...content,
            footer: { ...content.footer, [type]: newLinks }
        });
    };

    if (!content) return <div className="p-8 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-5xl">
            <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800">Footer & Links</h1>
                <p className="text-gray-500">Manage contact info, heritage description, and navigation links</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Branding Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-heritage-maroon" />
                        Branding & Logo
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={content.siteName}
                                    onChange={(e) => setContent({ ...content, siteName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Site Logo</Label>
                                <ImageUpload
                                    images={content.logo ? [content.logo] : []}
                                    onChange={(images) => setContent({ ...content, logo: images[0] || '' })}
                                    maxImages={1}
                                />
                                <p className="text-xs text-gray-400">Recommended: Square image, transparent background (PNG).</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                            <Label className="mb-4 text-gray-400 uppercase tracking-widest text-[10px] font-bold">Preview</Label>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                {content.logo ? (
                                    <img src={content.logo} alt="Logo" className="w-10 h-10 object-contain" />
                                ) : (
                                    <div className="w-10 h-10 bg-heritage-maroon rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">{content.siteName.charAt(0)}</span>
                                    </div>
                                )}
                                <span className="font-serif font-bold text-lg text-heritage-maroon">{content.siteName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment QR Code Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4 flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        Payment QR Code
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>GPay / UPI QR Code</Label>
                                <ImageUpload
                                    images={content.paymentQR ? [content.paymentQR] : []}
                                    onChange={(images) => setContent({ ...content, paymentQR: images[0] || '' })}
                                    maxImages={1}
                                />
                                <p className="text-xs text-gray-400">Upload your business GPay or UPI QR code for customers to scan during checkout.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200">
                            <Label className="mb-4 text-blue-400 uppercase tracking-widest text-[10px] font-bold">Checkout Preview</Label>
                            {content.paymentQR ? (
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <img src={content.paymentQR} alt="QR Preview" className="w-32 h-32 object-contain" />
                                </div>
                            ) : (
                                <div className="text-gray-400 italic text-sm">No QR code uploaded</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Contact & Address</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Contact Email</Label>
                            <Input
                                id="email"
                                value={content.footer.contactEmail}
                                onChange={(e) => setContent({
                                    ...content,
                                    footer: { ...content.footer, contactEmail: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Contact Phone</Label>
                            <Input
                                id="phone"
                                value={content.footer.contactPhone}
                                onChange={(e) => setContent({
                                    ...content,
                                    footer: { ...content.footer, contactPhone: e.target.value }
                                })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Physical Address</Label>
                        <textarea
                            id="address"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            value={content.footer.address}
                            onChange={(e) => setContent({
                                ...content,
                                footer: { ...content.footer, address: e.target.value }
                            })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mapUrl">Google Maps URL</Label>
                        <Input
                            id="mapUrl"
                            value={content.footer.mapUrl}
                            onChange={(e) => setContent({
                                ...content,
                                footer: { ...content.footer, mapUrl: e.target.value }
                            })}
                        />
                    </div>
                </div>

                {/* Notification Emails */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">Admin Notification Emails</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setContent({
                                ...content,
                                notificationEmails: [...content.notificationEmails, '']
                            })}
                            className="gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Email
                        </Button>
                    </div>
                    <p className="text-sm text-gray-500 italic">Emails for orders, enquiries, and security alerts will be sent to all addresses below.</p>

                    <div className="space-y-4">
                        {content.notificationEmails.map((email, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                <div className="flex-1 space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            const newEmails = [...content.notificationEmails];
                                            newEmails[idx] = e.target.value;
                                            setContent({ ...content, notificationEmails: newEmails });
                                        }}
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 h-10"
                                    onClick={() => {
                                        const newEmails = content.notificationEmails.filter((_, i) => i !== idx);
                                        setContent({ ...content, notificationEmails: newEmails });
                                    }}
                                    disabled={content.notificationEmails.length <= 1}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Heritage Text */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Our Heritage Section</h2>
                    <div className="space-y-2">
                        <Label htmlFor="heritage">Short Description</Label>
                        <textarea
                            id="heritage"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="Briefly describe the brand heritage..."
                            value={content.footer.heritageText}
                            onChange={(e) => setContent({
                                ...content,
                                footer: { ...content.footer, heritageText: e.target.value }
                            })}
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">Quick Links (Column 1)</h2>
                        <Button type="button" variant="outline" size="sm" onClick={() => addLink('quickLinks')} className="gap-2">
                            <Plus className="w-4 h-4" /> Add Link
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {content.footer.quickLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                <div className="flex-1 space-y-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={link.name}
                                        onChange={(e) => updateLink('quickLinks', idx, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>URL/Path</Label>
                                    <Input
                                        value={link.href}
                                        onChange={(e) => updateLink('quickLinks', idx, 'href', e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 h-10"
                                    onClick={() => removeLink('quickLinks', idx)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Business Links */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">Business Links (Column 2)</h2>
                        <Button type="button" variant="outline" size="sm" onClick={() => addLink('businessLinks')} className="gap-2">
                            <Plus className="w-4 h-4" /> Add Link
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {content.footer.businessLinks.map((link, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                <div className="flex-1 space-y-2">
                                    <Label>Label</Label>
                                    <Input
                                        value={link.name}
                                        onChange={(e) => updateLink('businessLinks', idx, 'name', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>URL/Path</Label>
                                    <Input
                                        value={link.href}
                                        onChange={(e) => updateLink('businessLinks', idx, 'href', e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 h-10"
                                    onClick={() => removeLink('businessLinks', idx)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={loading} className="px-8 gap-2">
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="outline" className="gap-2">
                            <Eye className="w-5 h-5" />
                            Preview Site
                        </Button>
                    </a>
                </div>
            </form>
        </div>
    );
}
