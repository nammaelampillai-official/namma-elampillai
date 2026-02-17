'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { getSiteContent } from '@/lib/dataStore';

export default function NavBar() {
    const { itemCount, toggleCart } = useCart();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        const fetchBranding = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    setContent(result.data);
                } else {
                    setContent(getSiteContent());
                }
            } catch (error) {
                console.error('Error fetching branding:', error);
                setContent(getSiteContent());
            }
        };
        fetchBranding();
    }, []);

    const siteName = content?.siteName || 'Namma Elampillai';
    const logo = content?.logo;

    return (
        <nav className="border-b border-heritage-gold/30 bg-white/80 sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-heritage-maroon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>

                    <Link href="/" className="flex items-center gap-2">
                        {logo ? (
                            <img src={logo} alt={siteName} className="w-8 h-8 object-contain" />
                        ) : (
                            <div className="w-8 h-8 bg-heritage-maroon rounded-full flex items-center justify-center">
                                <span className="text-heritage-gold font-bold text-lg">{siteName.charAt(0)}</span>
                            </div>
                        )}
                        <span className="text-xl font-serif font-bold text-heritage-maroon whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">{siteName}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/products" className="text-sm font-medium hover:text-heritage-maroon transition-colors">
                            Collections
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-heritage-maroon transition-colors">
                            Heritage
                        </Link>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-heritage-maroon relative hover:bg-heritage-maroon/10"
                        onClick={toggleCart}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-heritage-gold text-heritage-maroon text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                {itemCount}
                            </span>
                        )}
                        <span className="sr-only">Cart</span>
                    </Button>

                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">
                                    Hi, {user.name.split(' ')[0]}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <Button variant="default" size="sm" className="bg-heritage-maroon text-white hover:bg-heritage-maroon/90">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-heritage-gold/30 shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link
                        href="/products"
                        className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Collections
                    </Link>
                    <Link
                        href="/about"
                        className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Heritage
                    </Link>
                    {user ? (
                        <div className="flex flex-col gap-3 py-2">
                            <span className="text-sm font-medium text-gray-500">
                                Signed in as {user.name}
                            </span>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full bg-heritage-maroon text-white hover:bg-heritage-maroon/90">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}
