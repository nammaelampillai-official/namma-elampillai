'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { getProducts, deleteProduct, type Product } from '@/lib/dataStore';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const manufacturerId = localStorage.getItem('manufacturer_id');
            const url = manufacturerId ? `/api/products?manufacturerId=${manufacturerId}` : '/api/products';

            const res = await fetch(url);
            const result = await res.json();
            if (result.success) {
                setProducts(result.data);
            } else {
                console.error("Failed to load products:", result.error);
                // Optionally set an error state here to show UI
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const res = await fetch(`/api/products/${id}`, {
                    method: 'DELETE'
                });
                const result = await res.json();
                if (result.success) {
                    loadProducts();
                } else {
                    throw new Error(result.error || 'Failed to delete');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Products</h1>
                    <p className="text-gray-500">Manage your saree collection</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <PlusCircle className="w-5 h-5" />
                        Add New Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                    No products found. Add your first product!
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>
                                        <div className="relative w-16 h-20 bg-gray-100 rounded overflow-hidden">
                                            {product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-xs">
                                        <div className="line-clamp-2">{product.name}</div>
                                    </TableCell>
                                    <TableCell>{product.material}</TableCell>
                                    <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.isVerified ? 'verified' : 'outline'}>
                                            {product.isVerified ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/products/edit/${product._id}`}>
                                                <Button variant="ghost" size="sm" className="gap-2">
                                                    <Edit className="w-4 h-4" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(product._id, product.name)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
