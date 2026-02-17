'use client';

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

    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleBuyNow = () => {
        addToCart(product);
        router.push('/checkout');
    };

    return (
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
    );
}
