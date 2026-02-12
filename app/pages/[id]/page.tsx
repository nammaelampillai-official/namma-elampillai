'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPageById, type PageContent } from '@/lib/dataStore';
import { Calendar, Clock } from 'lucide-react';

export default function DynamicPage() {
    const params = useParams();
    const id = params.id as string;
    const [page, setPage] = useState<PageContent | null>(null);

    useEffect(() => {
        if (id) {
            setPage(getPageById(id));
        }
    }, [id]);

    if (!page) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-serif font-bold text-heritage-maroon mb-4">Page Not Found</h1>
                    <p className="text-gray-600">The page you are looking for does not exist or has been moved.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-heritage-cream/10 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <article className="bg-white rounded-2xl shadow-sm border border-heritage-gold/20 overflow-hidden">
                    {/* Header */}
                    <div className="bg-heritage-maroon p-12 text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{page.title}</h1>
                        <div className="flex items-center justify-center gap-6 text-heritage-cream/60 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Updated {new Date(page.lastUpdated).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Standard Policy</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-16">
                        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-heritage-maroon prose-p:text-gray-700 prose-li:text-gray-700">
                            {page.content.split('\n').map((para, i) => (
                                para ? <p key={i} className="mb-6 leading-relaxed text-lg">{para}</p> : <br key={i} />
                            ))}
                        </div>

                        {/* Special handling for Contact page */}
                        {id === 'contact' && (
                            <div className="mt-12 bg-heritage-cream/20 p-8 rounded-2xl border border-heritage-gold/20">
                                <h3 className="text-2xl font-serif font-bold text-heritage-maroon mb-6 text-center">Send us an Enquiry</h3>
                                <ContactForm />
                            </div>
                        )}
                    </div>

                    {/* Footer / Meta */}
                    <div className="bg-gray-50 p-8 border-t border-gray-100 italic text-gray-500 text-center">
                        <p>Namma Elampillai - Preserving the Weaving Heritage</p>
                    </div>
                </article>
            </div>
        </div>
    );
}

function ContactForm() {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            // Import action dynamically for client component
            const { sendEnquiryNotification } = await import('@/app/actions/email');
            await sendEnquiryNotification(formData);
            setSent(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            alert('Failed to send enquiry. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800">Thank you!</h4>
                <p className="text-gray-600">Your enquiry has been received. Our team will get back to you shortly.</p>
                <Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                    <input
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        required
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number (WhatsApp preferred)</label>
                <input
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message / Enquiry Details</label>
                <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                    placeholder="Tell us what you are looking for..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
            </div>
            <Button
                type="submit"
                disabled={sending}
                className="w-full py-4 text-lg bg-heritage-maroon hover:bg-heritage-maroon/90 text-white rounded-xl shadow-lg transition-all"
            >
                {sending ? 'Sending...' : 'Submit Enquiry'}
            </Button>
        </form>
    );
}

const Button = ({ children, onClick, type = "button", disabled = false, variant = "primary", className = "" }: any) => {
    const base = "px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50";
    const styles: any = {
        primary: "bg-heritage-maroon text-white hover:bg-heritage-maroon/90 shadow-md",
        outline: "border-2 border-heritage-maroon text-heritage-maroon hover:bg-heritage-maroon hover:text-white"
    };
    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
            {children}
        </button>
    );
};
