'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSiteContent, type SiteContent } from '@/lib/dataStore';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
    const [content, setContent] = useState<SiteContent | null>(null);

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
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-sm text-heritage-cream/60">
                                100% Authentic Handloom Products Direct from Salem District.
                            </p>
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
