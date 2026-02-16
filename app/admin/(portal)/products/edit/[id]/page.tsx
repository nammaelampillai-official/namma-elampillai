'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import ImageUpload from '@/components/admin/ImageUpload';
import { getProductById, updateProduct, getSiteContent } from '@/lib/dataStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';


export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [sareeTypes, setSareeTypes] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        material: 'Pure Silk',
        shopName: '',
        images: [] as string[],
        isVerified: true
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch saree types
                const contentRes = await fetch('/api/content');
                const contentData = await contentRes.json();
                if (contentData.success && contentData.data && contentData.data.sareeTypes) {
                    setSareeTypes(contentData.data.sareeTypes);
                }

                // Fetch product
                const productRes = await fetch(`/api/products/${productId}`);
                const productData = await productRes.json();
                if (productData.success && productData.data) {
                    const product = productData.data;
                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price.toString(),
                        material: product.material,
                        shopName: product.shopName || '',
                        images: product.images,
                        isVerified: product.isVerified
                    });
                } else {
                    console.error("Failed to fetch product:", productData.error);
                    alert('Product not found or failed to load');
                    router.push('/admin/products');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error loading product data');
                router.push('/admin/products');
            }
        };
        fetchData();
    }, [productId, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.images.length === 0) {
            alert('Please upload at least one product image');
            return;
        }

        setLoading(true);

        try {
            const productUpdate = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                material: formData.material,
                shopName: formData.shopName,
                images: formData.images,
                isVerified: formData.isVerified
            };

            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productUpdate)
            });

            const result = await res.json();
            if (result.success) {
                alert('Product updated successfully!');
                router.push('/admin/products');
            } else {
                throw new Error(result.error || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
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
                <h1 className="text-3xl font-serif font-bold text-gray-800">Edit Product</h1>
                <p className="text-gray-500">Update product details</p>
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
                            Published (visible to customers)
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
                        {loading ? 'Updating Product...' : 'Update Product'}
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
