'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { getSiteContent, saveSiteContent, type SiteContent, type PageContent } from '@/lib/dataStore';
import { Save, Eye, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PagesAdmin() {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<SiteContent | null>(null);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

    useEffect(() => {
        setContent(getSiteContent());
    }, []);

    const selectedPage = content?.pages.find(p => p.id === selectedPageId);

    const handleSave = () => {
        if (!content) return;
        setLoading(true);
        saveSiteContent(content);
        alert('Changes saved successfully!');
        setLoading(false);
    };

    const addPage = () => {
        if (!content) return;
        const newTitle = 'New Page';
        const newId = newTitle.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
        const newPage: PageContent = {
            id: newId,
            title: newTitle,
            content: 'Enter content here...',
            lastUpdated: new Date().toISOString()
        };
        setContent({ ...content, pages: [...content.pages, newPage] });
        setSelectedPageId(newId);
    };

    const deletePage = (id: string) => {
        if (!content) return;
        if (!confirm('Are you sure you want to delete this page?')) return;
        const newPages = content.pages.filter(p => p.id !== id);
        setContent({ ...content, pages: newPages });
        if (selectedPageId === id) setSelectedPageId(null);
    };

    const updatePageContent = (id: string, updates: Partial<PageContent>) => {
        if (!content) return;
        const newPages = content.pages.map(p => {
            if (p.id === id) {
                const updated = { ...p, ...updates, lastUpdated: new Date().toISOString() };
                // Also update ID if title changes and it's a new page (optional, but keep it simple for now)
                return updated;
            }
            return p;
        });
        setContent({ ...content, pages: newPages });
    };

    if (!content) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Site Pages & Policies</h1>
                    <p className="text-gray-500">Manage content for policies, FAQ, and business sections</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={addPage} className="gap-2">
                        <FileText className="w-5 h-5" />
                        Add New Page
                    </Button>
                    <Button onClick={handleSave} disabled={loading} className="gap-2">
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Page List */}
                <div className="lg:col-span-1 space-y-2">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Select Page</h2>
                    <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
                        {content.pages.map((page) => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPageId(page.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${selectedPageId === page.id
                                    ? 'bg-heritage-maroon text-white border-heritage-maroon shadow-lg'
                                    : 'bg-white text-gray-700 border-gray-100 hover:border-heritage-gold shadow-sm'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className={`w-5 h-5 ${selectedPageId === page.id ? 'text-heritage-gold' : 'text-gray-400'}`} />
                                    <span className="font-medium text-left">{page.title}</span>
                                </div>
                                <ChevronRight className={`w-4 h-4 ${selectedPageId === page.id ? 'text-heritage-gold' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-2">
                    {selectedPage ? (
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                                <h2 className="text-2xl font-bold text-gray-800">Edit: {selectedPage.title}</h2>
                                <div className="flex gap-2">
                                    <Link href={`/pages/${selectedPage.id}`} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Eye className="w-4 h-4" />
                                            Preview
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => deletePage(selectedPage.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pageTitle">Display Title</Label>
                                    <Input
                                        id="pageTitle"
                                        value={selectedPage.title}
                                        onChange={(e) => updatePageContent(selectedPage.id, { title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pageId">Page Slug (URL ID)</Label>
                                    <Input
                                        id="pageId"
                                        value={selectedPage.id}
                                        onChange={(e) => updatePageContent(selectedPage.id, { id: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pageContent">Content (Text only)</Label>
                                <textarea
                                    id="pageContent"
                                    rows={15}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all font-sans text-gray-700 leading-relaxed"
                                    placeholder="Write your page content here..."
                                    value={selectedPage.content}
                                    onChange={(e) => updatePageContent(selectedPage.id, { content: e.target.value })}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-xs text-gray-400">
                                        Last Updated: {new Date(selectedPage.lastUpdated).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-400 italic">
                                        Tip: Use empty lines for new paragraphs
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[500px] flex flex-col items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Select a page to edit or create a new one</p>
                            <Button variant="outline" className="mt-4" onClick={addPage}>+ Create New Page</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
