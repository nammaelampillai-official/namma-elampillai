'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Lock, User, Loader2 } from 'lucide-react';
import { sendLoginNotification } from '@/app/actions/email';
import { getSiteContent, PARTNER_MAPPINGS } from '@/lib/dataStore';

export default function PartnerLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const siteContent = getSiteContent();
        const isPartner = siteContent.partnerEmails.includes(email);
        const isAdmin = email === 'admin@namma.com';

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validation
        if ((isAdmin || isPartner) && password === 'partner2025!') {
            // Send notification
            sendLoginNotification(email).catch(console.error);

            // Success
            const role = isAdmin ? 'admin' : 'partner';
            document.cookie = `admin_session=true; path=/`;
            document.cookie = `admin_role=${role}; path=/`;

            // Also store in localStorage for easier client-side access in Sidebar
            localStorage.setItem('admin_role', role);

            if (role === 'partner') {
                const manufacturerId = PARTNER_MAPPINGS[email];
                if (manufacturerId) {
                    localStorage.setItem('manufacturer_id', manufacturerId);
                }
            } else {
                localStorage.removeItem('manufacturer_id');
            }

            router.push(role === 'partner' ? '/admin/products' : '/admin/dashboard');
        } else {
            setError('Invalid credentials. Please check your username and password.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Side - Brand / Image */}
            <div className="hidden md:flex flex-col justify-between w-1/2 bg-heritage-maroon text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <Image
                        src="/hero-saree.png"
                        alt="Background Pattern"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-serif font-bold mb-4">Namma Elampillai</h1>
                    <p className="text-heritage-gold/80 text-xl">Partner Portal</p>
                </div>

                <div className="relative z-10 space-y-6">
                    <blockquote className="text-2xl font-light italic">
                        "Weaving the future of tradition, one saree at a time."
                    </blockquote>
                    <div className="text-sm opacity-70">
                        &copy; {new Date().getFullYear()} Namma Elampillai Marketplace.
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-heritage-maroon rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 transform hover:rotate-6 transition-transform">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Please sign in to access your partner dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="partner@namma.com"
                                        className="pl-10 h-12"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <a href="#" className="text-xs font-semibold text-heritage-maroon hover:underline">
                                        Forgot Password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-12"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-medium bg-heritage-maroon hover:bg-heritage-maroon/90 shadow-lg shadow-heritage-maroon/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In to Dashboard'
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-400">
                        Help & Support: <a href="mailto:support@namma.com" className="text-heritage-maroon font-medium hover:underline">support@namma.com</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
