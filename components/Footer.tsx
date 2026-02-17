'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { type SiteContent } from '@/lib/dataStore';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
    initialContent?: SiteContent;
}

export default function Footer({ initialContent }: FooterProps) {
    const [content, setContent] = useState<SiteContent | null>(initialContent || null);

    useEffect(() => {
        // Only fetch if not provided via props (SSR support)
        if (!initialContent) {
            const fetchBranding = async () => {
                try {
                    const res = await fetch('/api/content');
                    const result = await res.json();
                    if (result.success && result.data) {
                        setContent(result.data);
                    }
                } catch (error) {
                    console.error('Error fetching branding:', error);
                }
            };
            fetchBranding();
        }
    }, [initialContent]);

    if (!content) return null;

    const { footer, siteName } = content;

    return (
        <footer className="bg-heritage-maroon text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand & Address */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-serif font-bold text-heritage-gold">{siteName}</h3>
                        <div className="space-y-4 text-heritage-cream/80">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-heritage-gold shrink-0 mt-1" />
                                <div>
                                    <p className="leading-relaxed">{footer.address}</p>
                                    <a
                                        href={footer.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-heritage-gold hover:underline flex items-center gap-1 mt-2 text-sm"
                                    >
                                        View on Map <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-heritage-gold" />
                                <a href={`mailto:${footer.contactEmail}`} className="hover:text-white transition-colors">
                                    {footer.contactEmail}
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-heritage-gold" />
                                <a href={`tel:${footer.contactPhone}`} className="hover:text-white transition-colors">
                                    {footer.contactPhone}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-heritage-gold uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-4">
                            {footer.quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="text-heritage-cream/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Business Section */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-heritage-gold uppercase tracking-wider">Business</h4>
                        <ul className="space-y-4">
                            {footer.businessLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="text-heritage-cream/80 hover:text-white hover:translate-x-1 transition-all inline-block">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Meta */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-bold mb-6 text-heritage-gold uppercase tracking-wider">Our Heritage</h4>
                        <p className="text-heritage-cream/80 leading-relaxed">
                            {footer.heritageText}
                        </p>
                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <p className="text-sm text-heritage-cream/60">
                                100% Authentic Handloom Products Direct from Salem District.
                            </p>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://facebook.com/nammaelampillai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-heritage-cream"
                                    title="Follow us on Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.instagram.com/namma.elampillai?igsh=MTFjNzJsYnFlaTRwNg=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all text-heritage-cream"
                                    title="Follow us on Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.061 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.247-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.061-2.633-.333-3.608-1.308-.975-.975-1.247-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.youtube.com/@Namma_Elampillai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all text-heritage-cream"
                                    title="Follow us on YouTube"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-white/10 text-center text-heritage-cream/40 text-sm">
                    <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved. Locally Sourced from Elampillai.</p>
                </div>
            </div>
        </footer>
    );
}
