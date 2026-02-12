
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const navItems = [
    { href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-heritage-maroon text-white min-h-screen flex flex-col shadow-xl">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-serif font-bold text-heritage-gold">Weaver Portal</h2>
                <p className="text-xs text-white/60 uppercase tracking-widest mt-1">Admin Dashboard</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

                    return (
                        <Link key={item.href} href={item.href}>
                            <span className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-heritage-gold text-heritage-maroon shadow-md"
                                    : "text-white/80 hover:bg-white/10 hover:text-white"
                            )}>
                                <Icon className={cn("w-5 h-5", isActive ? "text-heritage-maroon" : "text-heritage-gold")} />
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => window.location.href = '/'}
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
