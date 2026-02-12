
'use client';

import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function CartSheet() {
    const { items, removeFromCart, total, isCartOpen, toggleCart } = useCart();
    const sheetRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sheetRef.current && !sheetRef.current.contains(event.target as Node) && isCartOpen) {
                toggleCart();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCartOpen, toggleCart]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div
                ref={sheetRef}
                className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-heritage-maroon/5">
                    <h2 className="text-xl font-serif font-bold text-heritage-maroon flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Your Cart
                    </h2>
                    <Button variant="ghost" size="sm" onClick={toggleCart} className="hover:bg-heritage-maroon/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <ShoppingBag className="w-16 h-16 text-gray-300" />
                            <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
                            <Button variant="outline" onClick={toggleCart}>Continue Shopping</Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item._id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 relative group">
                                <div className="relative w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                    <p className="text-heritage-maroon font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="absolute top-0 right-0 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <Link href="/checkout" onClick={toggleCart}>
                            <Button className="w-full py-6 text-lg shadow-lg shadow-heritage-gold/20">
                                Checkout
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
