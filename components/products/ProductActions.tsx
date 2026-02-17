'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductActionsProps {
    product: any;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [selectedColor, setSelectedColor] = useState<string | null>(
        product.colors?.length > 0 ? product.colors[0] : null
    );

    const handleAddToCart = () => {
        if (product.colors?.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }
        addToCart({ ...product, selectedColor });
    };

    const handleBuyNow = () => {
        if (product.colors?.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }
        addToCart({ ...product, selectedColor });
        router.push('/checkout');
    };

    return (
        <div className="space-y-6">
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                        Available Colors
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.colors.map((color: string) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${selectedColor === color
                                        ? 'bg-heritage-maroon text-white border-heritage-maroon shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-heritage-maroon/50'
                                    }`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                {/* Add to Cart - Enlarged for Mobile */}
                <Button
                    onClick={handleAddToCart}
                    className="flex-1 w-full gap-3 bg-heritage-maroon text-heritage-gold border border-heritage-gold hover:bg-heritage-maroon/90 h-14 sm:h-12 text-lg sm:text-base font-bold shadow-lg shadow-heritage-maroon/20"
                >
                    <ShoppingCart className="w-6 h-6 sm:w-5 sm:h-5" />
                    Add to Cart
                </Button>

                {/* Buy Now - Enlarged for Mobile */}
                <Button
                    onClick={handleBuyNow}
                    variant="secondary"
                    className="flex-1 w-full h-14 sm:h-12 text-lg sm:text-base font-bold shadow-lg shadow-heritage-gold/20"
                >
                    Buy Now
                </Button>
            </div>
        </div>
    );
}
