'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FileText,
    Image as ImageIcon,
    Settings,
    Home,
    PlusCircle
} from 'lucide-react';
import { getSiteContent } from '@/lib/dataStore';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    {
        name: 'Products',
        icon: Package,
        children: [
            { name: 'All Products', href: '/admin/products' },
            { name: 'Add New', href: '/admin/products/new' },
            { name: 'Manage Varieties', href: '/admin/settings/categories' },
            { name: 'Checkout Settings', href: '/admin/settings/checkout' },
        ]
    },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    {
        name: 'Site Content',
        icon: FileText,
        children: [
            { name: 'Homepage', href: '/admin/content/homepage' },
            { name: 'About Page', href: '/admin/content/about' },
            { name: 'Footer & Links', href: '/admin/content/footer' },
            { name: 'Policy Pages', href: '/admin/content/pages' },
        ]
    },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Partner Management', href: '/admin/settings/partners', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState<string | null>(null);
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        setRole(localStorage.getItem('admin_role'));

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

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    const filteredNavigation = navigation.filter(item => {
        if (role === 'partner') {
            // Partners only see Products section
            return item.name === 'Products';
        }
        return true; // Admin sees everything
    }).map(item => {
        if (role === 'partner' && item.name === 'Products') {
            // Partners see "All Products" and "Add New"
            return {
                ...item,
                children: item.children?.filter(child =>
                    child.name === 'All Products' || child.name === 'Add New'
                )
            };
        }
        return item;
    });

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
            {/* Logo / Brand */}
            <Link href={role === 'partner' ? '/admin/products/new' : '/admin/dashboard'} className="flex items-center gap-3 mb-8">
                {logo ? (
                    <img src={logo} alt={siteName} className="w-10 h-10 object-contain rounded-lg" />
                ) : (
                    <div className="w-10 h-10 bg-heritage-maroon rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{siteName.charAt(0)}</span>
                    </div>
                )}
                <div>
                    <h1 className="font-serif font-bold text-lg text-heritage-maroon">{siteName}</h1>
                    <p className="text-xs text-gray-500">{role === 'partner' ? 'Partner Portal' : 'Admin Panel'}</p>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="space-y-1">
                {filteredNavigation.map((item) => (
                    <div key={item.name}>
                        {item.children ? (
                            // Parent with children
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700">
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </div>
                                <div className="ml-8 space-y-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${isActive(child.href)
                                                ? 'bg-heritage-maroon text-white font-medium'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Single item
                            <Link
                                href={item.href!}
                                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isActive(item.href!)
                                    ? 'bg-heritage-maroon text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            {/* Back to Site */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Home className="w-5 h-5" />
                    <span>Back to Site</span>
                </Link>
            </div>
        </aside>
    );
}
