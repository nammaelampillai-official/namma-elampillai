'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import ImageUpload from '@/components/admin/ImageUpload';
import { getSiteContent, saveSiteContent, type SiteContent, DEFAULT_SITE_CONTENT } from '@/lib/dataStore';
import { Save, Eye } from 'lucide-react';

const ICON_OPTIONS = [
    { value: 'sparkles', label: 'Sparkles ✨' },
    { value: 'badge-check', label: 'Badge Check ✓' },
    { value: 'users', label: 'Users 👥' },
    { value: 'heart', label: 'Heart ❤️' },
    { value: 'star', label: 'Star ⭐' },
    { value: 'shield', label: 'Shield 🛡️' }
];

export default function HomepageContentPage() {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<SiteContent | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    setContent({ ...DEFAULT_SITE_CONTENT, ...result.data });
                } else {
                    // Fallback to local if API fails or is empty during migration
                    setContent(getSiteContent());
                }
            } catch (error) {
                console.error('Error fetching content:', error);
                setContent(getSiteContent());
            }
        };
        fetchData();
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
                if (res.status === 413 || text.toLowerCase().includes('payload too large')) {
                    throw new Error('Images are too large for the server. Please compress them further.');
                }
                throw new Error(`Server Error (${res.status}): ${text.slice(0, 100)}`);
            }

            const result = await res.json();
            if (result.success) {
                alert('Homepage content updated successfully!');
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

    return (
        <div className="max-w-5xl">
            <div className="mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-800">Homepage Content</h1>
                <p className="text-gray-500">Manage hero section, slogans, and feature cards</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Hero Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Hero Section</h2>
                        <a href="/" target="_blank" rel="noopener noreferrer">
                            <Button type="button" variant="outline" size="sm" className="gap-2">
                                <Eye className="w-4 h-4" />
                                Preview Site
                            </Button>
                        </a>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Main Title *</Label>
                        <Input
                            id="heroTitle"
                            required
                            placeholder="e.g., Weaving Heritage"
                            value={content.hero.title}
                            onChange={(e) => setContent({
                                ...content,
                                hero: { ...content.hero, title: e.target.value }
                            })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="heroSubtitle">Subtitle *</Label>
                        <textarea
                            id="heroSubtitle"
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="e.g., Authentic Elampillai silk sarees..."
                            value={content.hero.subtitle}
                            onChange={(e) => setContent({
                                ...content,
                                hero: { ...content.hero, subtitle: e.target.value }
                            })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Background Image</Label>
                        <ImageUpload
                            images={content.hero.backgroundImage ? [content.hero.backgroundImage] : []}
                            onChange={(images) => setContent({
                                ...content,
                                hero: { ...content.hero, backgroundImage: images[0] || '' }
                            })}
                            maxImages={1}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="primaryBtnText">Primary Button Text</Label>
                            <Input
                                id="primaryBtnText"
                                placeholder="Shop Collections"
                                value={content.hero.ctaButtons.primary.text}
                                onChange={(e) => setContent({
                                    ...content,
                                    hero: {
                                        ...content.hero,
                                        ctaButtons: {
                                            ...content.hero.ctaButtons,
                                            primary: { ...content.hero.ctaButtons.primary, text: e.target.value }
                                        }
                                    }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="primaryBtnLink">Primary Button Link</Label>
                            <Input
                                id="primaryBtnLink"
                                placeholder="/products"
                                value={content.hero.ctaButtons.primary.link}
                                onChange={(e) => setContent({
                                    ...content,
                                    hero: {
                                        ...content.hero,
                                        ctaButtons: {
                                            ...content.hero.ctaButtons,
                                            primary: { ...content.hero.ctaButtons.primary, link: e.target.value }
                                        }
                                    }
                                })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="secondaryBtnText">Secondary Button Text</Label>
                            <Input
                                id="secondaryBtnText"
                                placeholder="Our Story"
                                value={content.hero.ctaButtons.secondary.text}
                                onChange={(e) => setContent({
                                    ...content,
                                    hero: {
                                        ...content.hero,
                                        ctaButtons: {
                                            ...content.hero.ctaButtons,
                                            secondary: { ...content.hero.ctaButtons.secondary, text: e.target.value }
                                        }
                                    }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="secondaryBtnLink">Secondary Button Link</Label>
                            <Input
                                id="secondaryBtnLink"
                                placeholder="/about"
                                value={content.hero.ctaButtons.secondary.link}
                                onChange={(e) => setContent({
                                    ...content,
                                    hero: {
                                        ...content.hero,
                                        ctaButtons: {
                                            ...content.hero.ctaButtons,
                                            secondary: { ...content.hero.ctaButtons.secondary, link: e.target.value }
                                        }
                                    }
                                })}
                            />
                        </div>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Feature Cards</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newCards = [...content.featureCards, {
                                    id: Date.now().toString(),
                                    icon: 'sparkles',
                                    title: 'New Feature',
                                    description: 'Describe this feature...'
                                }];
                                setContent({ ...content, featureCards: newCards });
                            }}
                            disabled={content.featureCards.length >= 6}
                        >
                            + Add Card
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.featureCards.map((card, index) => (
                            <div key={card.id} className="p-4 border border-gray-200 rounded-lg space-y-4 relative">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">Card {index + 1}</h3>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            const newCards = content.featureCards.filter(c => c.id !== card.id);
                                            setContent({ ...content, featureCards: newCards });
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`cardIcon${index}`}>Icon</Label>
                                        <select
                                            id={`cardIcon${index}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                                            value={card.icon}
                                            onChange={(e) => {
                                                const newCards = [...content.featureCards];
                                                newCards[index] = { ...card, icon: e.target.value };
                                                setContent({ ...content, featureCards: newCards });
                                            }}
                                        >
                                            {ICON_OPTIONS.map((icon) => (
                                                <option key={icon.value} value={icon.value}>
                                                    {icon.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`cardTitle${index}`}>Title</Label>
                                        <Input
                                            id={`cardTitle${index}`}
                                            required
                                            placeholder="e.g., Handwoven Perfection"
                                            value={card.title}
                                            onChange={(e) => {
                                                const newCards = [...content.featureCards];
                                                newCards[index] = { ...card, title: e.target.value };
                                                setContent({ ...content, featureCards: newCards });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`cardDesc${index}`}>Description</Label>
                                    <textarea
                                        id={`cardDesc${index}`}
                                        required
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                                        placeholder="Describe this feature..."
                                        value={card.description}
                                        onChange={(e) => {
                                            const newCards = [...content.featureCards];
                                            newCards[index] = { ...card, description: e.target.value };
                                            setContent({ ...content, featureCards: newCards });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Elampillai Town Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Elampillai Town Showcase</h2>

                    <div className="space-y-2">
                        <Label htmlFor="townDesc">Town Description</Label>
                        <textarea
                            id="townDesc"
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                            placeholder="Describe the town and its heritage..."
                            value={content.elampillai.description}
                            onChange={(e) => setContent({
                                ...content,
                                elampillai: { ...content.elampillai, description: e.target.value }
                            })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Town Images (Grid)</Label>
                        <ImageUpload
                            images={content.elampillai.images}
                            onChange={(images) => setContent({
                                ...content,
                                elampillai: { ...content.elampillai, images }
                            })}
                            maxImages={4}
                        />
                        <p className="text-xs text-gray-400">Add up to 4 images to showcase the town and its weavers.</p>
                    </div>
                </div>

                {/* Visual Categories */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Visual Categories (Homepage Grid)</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newCats = [...content.visualCategories, {
                                    name: 'New Category',
                                    image: '',
                                    link: '/products'
                                }];
                                setContent({ ...content, visualCategories: newCats });
                            }}
                        >
                            + Add Category
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.visualCategories.map((cat, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">Category {index + 1}</h3>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        onClick={() => {
                                            const newCats = content.visualCategories.filter((_, i) => i !== index);
                                            setContent({ ...content, visualCategories: newCats });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            value={cat.name}
                                            onChange={(e) => {
                                                const newCats = [...content.visualCategories];
                                                newCats[index] = { ...cat, name: e.target.value };
                                                setContent({ ...content, visualCategories: newCats });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Link</Label>
                                        <Input
                                            value={cat.link}
                                            onChange={(e) => {
                                                const newCats = [...content.visualCategories];
                                                newCats[index] = { ...cat, link: e.target.value };
                                                setContent({ ...content, visualCategories: newCats });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Image</Label>
                                        <ImageUpload
                                            images={cat.image ? [cat.image] : []}
                                            onChange={(images) => {
                                                const newCats = [...content.visualCategories];
                                                newCats[index] = { ...cat, image: images[0] || '' };
                                                setContent({ ...content, visualCategories: newCats });
                                            }}
                                            maxImages={1}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sarees by Price */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Sarees by Price</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newRanges = [...content.priceRanges, {
                                    label: 'New Range',
                                    image: ''
                                }];
                                setContent({ ...content, priceRanges: newRanges });
                            }}
                        >
                            + Add Range
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.priceRanges.map((range, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">Range {index + 1}</h3>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        onClick={() => {
                                            const newRanges = content.priceRanges.filter((_, i) => i !== index);
                                            setContent({ ...content, priceRanges: newRanges });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Min (₹)</Label>
                                        <Input
                                            type="number"
                                            value={range.min || ''}
                                            onChange={(e) => {
                                                const newRanges = [...content.priceRanges];
                                                newRanges[index] = { ...range, min: e.target.value ? parseInt(e.target.value) : undefined };
                                                setContent({ ...content, priceRanges: newRanges });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Max (₹)</Label>
                                        <Input
                                            type="number"
                                            value={range.max || ''}
                                            onChange={(e) => {
                                                const newRanges = [...content.priceRanges];
                                                newRanges[index] = { ...range, max: e.target.value ? parseInt(e.target.value) : undefined };
                                                setContent({ ...content, priceRanges: newRanges });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Label (e.g., Under ₹2000)</Label>
                                    <Input
                                        value={range.label}
                                        onChange={(e) => {
                                            const newRanges = [...content.priceRanges];
                                            newRanges[index] = { ...range, label: e.target.value };
                                            setContent({ ...content, priceRanges: newRanges });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Range Image (Circle)</Label>
                                    <ImageUpload
                                        images={range.image ? [range.image] : []}
                                        onChange={(images) => {
                                            const newRanges = [...content.priceRanges];
                                            newRanges[index] = { ...range, image: images[0] || '' };
                                            setContent({ ...content, priceRanges: newRanges });
                                        }}
                                        maxImages={1}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Stories */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Customer Stories</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newStories = [...content.customerStories, {
                                    id: Date.now().toString(),
                                    name: 'New Customer',
                                    content: '',
                                    rating: 5,
                                    location: ''
                                }];
                                setContent({ ...content, customerStories: newStories });
                            }}
                        >
                            + Add Story
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {content.customerStories.map((story, index) => (
                            <div key={story.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-700">Story {index + 1}</h3>
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 text-sm"
                                        onClick={() => {
                                            const newStories = content.customerStories.filter(s => s.id !== story.id);
                                            setContent({ ...content, customerStories: newStories });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Customer Name</Label>
                                        <Input
                                            value={story.name}
                                            onChange={(e) => {
                                                const newStories = [...content.customerStories];
                                                newStories[index] = { ...story, name: e.target.value };
                                                setContent({ ...content, customerStories: newStories });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            value={story.location || ''}
                                            onChange={(e) => {
                                                const newStories = [...content.customerStories];
                                                newStories[index] = { ...story, location: e.target.value };
                                                setContent({ ...content, customerStories: newStories });
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Story / Review</Label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-heritage-maroon"
                                        value={story.content}
                                        onChange={(e) => {
                                            const newStories = [...content.customerStories];
                                            newStories[index] = { ...story, content: e.target.value };
                                            setContent({ ...content, customerStories: newStories });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Rating (1-5)</Label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        value={story.rating}
                                        onChange={(e) => {
                                            const newStories = [...content.customerStories];
                                            newStories[index] = { ...story, rating: parseInt(e.target.value) };
                                            setContent({ ...content, customerStories: newStories });
                                        }}
                                    >
                                        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Feed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Connect With Us (Social Feed)</h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={content.socialFeed.title}
                                onChange={(e) => setContent({
                                    ...content,
                                    socialFeed: { ...content.socialFeed, title: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle / Handle</Label>
                            <Input
                                value={content.socialFeed.subtitle}
                                onChange={(e) => setContent({
                                    ...content,
                                    socialFeed: { ...content.socialFeed, subtitle: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Grid Images</Label>
                            <ImageUpload
                                images={content.socialFeed.images}
                                onChange={(images) => setContent({
                                    ...content,
                                    socialFeed: { ...content.socialFeed, images }
                                })}
                                maxImages={8}
                            />
                            <p className="text-xs text-gray-400">Add up to 8 images for the social grid.</p>
                        </div>
                    </div>
                </div>

                {/* YouTube Feed */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">YouTube Feed</h2>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const newVideos = [...content.youtubeFeed.videos, {
                                    id: 'dQw4w9WgXcQ',
                                    title: 'New Video'
                                }];
                                setContent({
                                    ...content,
                                    youtubeFeed: { ...content.youtubeFeed, videos: newVideos }
                                });
                            }}
                        >
                            + Add Video
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                                value={content.youtubeFeed.title}
                                onChange={(e) => setContent({
                                    ...content,
                                    youtubeFeed: { ...content.youtubeFeed, title: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtitle</Label>
                            <Input
                                value={content.youtubeFeed.subtitle}
                                onChange={(e) => setContent({
                                    ...content,
                                    youtubeFeed: { ...content.youtubeFeed, subtitle: e.target.value }
                                })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {content.youtubeFeed.videos.map((video, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 relative">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-gray-700">Video {index + 1}</h3>
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700 text-sm"
                                            onClick={() => {
                                                const newVideos = content.youtubeFeed.videos.filter((_, i) => i !== index);
                                                setContent({
                                                    ...content,
                                                    youtubeFeed: { ...content.youtubeFeed, videos: newVideos }
                                                });
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Video ID (e.g., dQw4w9WgXcQ)</Label>
                                        <Input
                                            value={video.id}
                                            onChange={(e) => {
                                                const newVideos = [...content.youtubeFeed.videos];
                                                newVideos[index] = { ...video, id: e.target.value };
                                                setContent({
                                                    ...content,
                                                    youtubeFeed: { ...content.youtubeFeed, videos: newVideos }
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Video Title</Label>
                                        <Input
                                            value={video.title}
                                            onChange={(e) => {
                                                const newVideos = [...content.youtubeFeed.videos];
                                                newVideos[index] = { ...video, title: e.target.value };
                                                setContent({
                                                    ...content,
                                                    youtubeFeed: { ...content.youtubeFeed, videos: newVideos }
                                                });
                                            }}
                                        />
                                    </div>
                                    {video.id && (
                                        <div className="aspect-video mt-2 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button type="submit" disabled={loading} className="px-8 gap-2">
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="outline" className="gap-2">
                            <Eye className="w-5 h-5" />
                            Preview Homepage
                        </Button>
                    </a>
                </div>
            </form>
        </div>
    );
}
