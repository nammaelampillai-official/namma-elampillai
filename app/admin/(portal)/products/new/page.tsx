'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import ImageUpload from '@/components/admin/ImageUpload';
import { addProduct, getSiteContent } from '@/lib/dataStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [sareeTypes, setSareeTypes] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        material: '',
        shopName: '',
        images: [] as string[],
        isVerified: true
    });

    useEffect(() => {
        const fetchSareeTypes = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data && result.data.sareeTypes) {
                    setSareeTypes(result.data.sareeTypes);
                    if (result.data.sareeTypes.length > 0) {
                        setFormData(prev => ({ ...prev, material: result.data.sareeTypes[0] }));
                    }
                } else {
                    const content = getSiteContent();
                    setSareeTypes(content.sareeTypes);
                }
            } catch (error) {
                console.error('Error fetching saree types:', error);
                const content = getSiteContent();
                setSareeTypes(content.sareeTypes);
            }
        };
        fetchSareeTypes();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert('Please upload at least one product image');
            return;
        }

        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                material: formData.material,
                shopName: formData.shopName,
                images: formData.images,
                manufacturerId: '65c2a1e4e4b0a1a1a1a1a1a1', // Example Mongo ID, or use a real admin ID
                isVerified: formData.isVerified
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const result = await res.json();
            if (result.success) {
                alert('Product added successfully!');
                router.push('/admin/products');
            } else {
                throw new Error(result.error || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-serif font-bold text-gray-800">Add New Product</h1>
                <p className="text-gray-500">Create a new saree listing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>

                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                            id="name"
                            required
                            placeholder="e.g., Royal Blue Elampillai Silk"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <textarea
                            id="description"
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="Describe the saree, its features, and what makes it special..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹) *</Label>
                            <Input
                                id="price"
                                type="number"
                                required
                                min="0"
                                step="1"
                                placeholder="4500"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="material">Material *</Label>
                            <select
                                id="material"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                                value={formData.material}
                                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                            >
                                {sareeTypes.map((material) => (
                                    <option key={material} value={material}>
                                        {material}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shopName">Shop / Manufacturer Name</Label>
                        <Input
                            id="shopName"
                            placeholder="e.g., Heritage Weaves"
                            value={formData.shopName}
                            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            <input
                                type="checkbox"
                                checked={formData.isVerified}
                                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                                className="mr-2"
                            />
                            Publish immediately (make visible to customers)
                        </Label>
                    </div>
                </div>

                {/* Product Images */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Product Images</h2>
                    <ImageUpload
                        images={formData.images}
                        onChange={(images) => setFormData({ ...formData, images })}
                        maxImages={5}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={loading} className="px-8">
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
