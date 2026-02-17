import { getSiteContentServer } from '@/lib/server/data';
import { Calendar, Clock } from 'lucide-react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DynamicPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const content = await getSiteContentServer();

    // Find the page in content.pages
    const page = content.pages?.find((p: any) => p.id === id);

    if (!page) {
        redirect('/');
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
                                <span>Updated {new Date(page.lastUpdated || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Standard Policy</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-16">
                        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-heritage-maroon prose-p:text-gray-700 prose-li:text-gray-700 font-sans">
                            {page.content.split('\n').map((para: string, i: number) => (
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

// Client component part for the form
import ContactFormClient from '@/components/ContactFormClient';
function ContactForm() {
    return <ContactFormClient />;
}
