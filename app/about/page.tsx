import Image from 'next/image';
import { getSiteContentServer } from '@/lib/server/data';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    const content = await getSiteContentServer();
    const about = content.about;

    if (!about) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-heritage-maroon border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-16">

                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-heritage-maroon">{about.title}</h1>
                    <div className="relative h-64 md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl mt-8 ring-1 ring-heritage-gold/20">
                        <Image
                            src={about.image || '/images/heritage-hero.png'}
                            alt="Weaving Heritage"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </section>

                {/* Main Story */}
                <section className="bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-heritage-gold/10">
                    <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed font-serif text-justify">
                        {about.description.split('\n').map((paragraph: string, idx: number) => (
                            <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                    </div>
                </section>

                {/* Mission & Vision Grid */}
                <section className="grid md:grid-cols-2 gap-8">
                    {/* Mission */}
                    <div className="bg-heritage-cream/20 p-8 rounded-xl border border-heritage-gold/20 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-heritage-maroon text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h2 className="text-xl font-serif font-bold text-heritage-maroon mb-4">Our Mission</h2>
                        <p className="text-gray-700">{about.mission}</p>
                    </div>

                    {/* Vision */}
                    <div className="bg-heritage-maroon/5 p-8 rounded-xl border border-heritage-maroon/10 hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-heritage-gold text-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-heritage-maroon mb-4">Our Vision</h2>
                        <p className="text-gray-700">{about.vision}</p>
                    </div>
                </section>

                {/* Footer/Quote */}
                <section className="text-center py-12 border-t border-heritage-gold/20">
                    <blockquote className="text-xl md:text-3xl font-serif text-gray-500 italic max-w-2xl mx-auto">
                        "We don't just sell sarees; we share a piece of our history."
                    </blockquote>
                </section>

            </div>
        </div>
    );
}
