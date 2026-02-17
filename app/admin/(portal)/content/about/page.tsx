'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import ImageUpload from '@/components/admin/ImageUpload';
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/dataStore';
import { Save, Eye } from 'lucide-react';

export default function AboutContentPage() {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    setContent(result.data);
                }
            } catch (error) {
                console.error('Error fetching about content:', error);
            }
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!content) return;

        // Pre-flight check for payload size (Vercel limit is ~4.5MB)
        const payloadString = JSON.stringify(content);
        const payloadSizeMb = payloadString.length / (1024 * 1024);

        if (payloadSizeMb > 10) {
            alert(`The total content size (${payloadSizeMb.toFixed(1)}MB) is too large. Please use smaller images or remove some pictures before saving (Max 10MB).`);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payloadString
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server Error (${res.status}): ${text.slice(0, 100)}`);
            }

            const result = await res.json();
            if (result.success) {
                alert('About page content updated successfully!');
            } else {
                throw new Error(result.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert(`Failed to save content: ${error instanceof Error ? error.message : 'Unknown Error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (!content) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // Default empty about object if it doesn't exist yet (for migration)
    const about = content.about || {
        title: '',
        description: '',
        image: '',
        mission: '',
        vision: ''
    };

    const updateAbout = (updates: Partial<typeof about>) => {
        setContent({
            ...content,
            about: { ...about, ...updates }
        });
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800">About Page Content</h1>
                <p className="text-gray-500">Manage your story, mission, and vision</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Main Story Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Our Story</h2>

                    <div className="space-y-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Our Story"
                            value={about.title}
                            onChange={(e) => updateAbout({ title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Main Story / Description</Label>
                        <textarea
                            id="description"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="Tell the story of Namma Elampillai..."
                            value={about.description}
                            onChange={(e) => updateAbout({ description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Featured Image</Label>
                        <ImageUpload
                            images={about.image ? [about.image] : []}
                            onChange={(images) => updateAbout({ image: images[0] || '' })}
                            maxImages={1}
                        />
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Mission & Vision</h2>

                    <div className="space-y-2">
                        <Label htmlFor="mission">Our Mission</Label>
                        <textarea
                            id="mission"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="To empower local weavers..."
                            value={about.mission}
                            onChange={(e) => updateAbout({ mission: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="vision">Our Vision</Label>
                        <textarea
                            id="vision"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="To become a global brand..."
                            value={about.vision}
                            onChange={(e) => updateAbout({ vision: e.target.value })}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 sticky bottom-6 bg-white/80 backdrop-blur p-4 rounded-lg border border-gray-200 shadow-lg">
                    <Button type="submit" disabled={loading} className="px-8 gap-2">
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <a href="/about" target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="outline" className="gap-2">
                            <Eye className="w-5 h-5" />
                            Preview Page
                        </Button>
                    </a>
                </div>
            </form>
        </div>
    );
}
