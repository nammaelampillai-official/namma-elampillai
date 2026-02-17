'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: any; // Using any to avoid importing backend model
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if button is clicked
        addToCart(product);
    };

    return (
        <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <Link href={`/products/${product._id}`} className="relative block aspect-[3/4] overflow-hidden bg-muted">
                {product.images && product.images[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name || 'Saree'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                )}
                {product.isVerified && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="verified">Verified Weaver</Badge>
                    </div>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                <Link href={`/products/${product._id}`}>
                    <h3 className="text-lg font-serif font-bold text-heritage-maroon dark:text-heritage-gold mb-1 group-hover:underline decoration-heritage-gold underline-offset-4">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-1 truncate">{product.material}</p>
                {product.shopName && (
                    <p className="text-xs font-medium text-heritage-gold uppercase tracking-wider mb-2">
                        {product.shopName}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">₹{product.price?.toLocaleString('en-IN')}</span>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="gap-2 transition-transform active:scale-95"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-4 h-4" /> Add
                    </Button>
                </div>
            </div>
        </div>
    );
}
