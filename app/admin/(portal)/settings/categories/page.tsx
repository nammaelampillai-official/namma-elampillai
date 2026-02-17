'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/dataStore';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SareeTypesPage() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [newType, setNewType] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('/api/content');
                const result = await res.json();
                if (result.success && result.data) {
                    setContent(result.data);
                }
            } catch (error) {
                console.error('Error fetching varieties:', error);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async () => {
        if (!content) return;
        try {
            const res = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(content)
            });
            const result = await res.json();
            if (result.success) {
                alert('Saree varieties updated successfully!');
            } else {
                throw new Error(result.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving varieties:', error);
            alert('Failed to save varieties');
        }
    };

    const addType = () => {
        if (!content || !newType.trim()) return;
        if (content.sareeTypes.includes(newType.trim())) {
            alert('This variety already exists');
            return;
        }
        setContent({
            ...content,
            sareeTypes: [...content.sareeTypes, newType.trim()]
        });
        setNewType('');
    };

    const removeType = (typeToRemove: string) => {
        if (!content) return;
        if (!confirm(`Are you sure you want to remove "${typeToRemove}"? Products using this type might need manual updates.`)) return;
        setContent({
            ...content,
            sareeTypes: content.sareeTypes.filter(t => t !== typeToRemove)
        });
    };

    if (!content) return <div className="p-8 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>
                <h1 className="text-3xl font-serif font-bold text-gray-800">Saree Varieties & Types</h1>
                <p className="text-gray-500">Manage the categories of sarees available in your marketplace</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex gap-4 items-end pb-6 border-b border-gray-50">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="newType">Add New Variety</Label>
                        <Input
                            id="newType"
                            placeholder="e.g., Kanchipuram Silk"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addType()}
                        />
                    </div>
                    <Button onClick={addType} className="gap-2">
                        <Plus className="w-4 h-4" /> Add
                    </Button>
                </div>

                <div className="space-y-3">
                    <Label>Available Varieties</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {content.sareeTypes.map((type) => (
                            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                <span className="font-medium text-gray-700">{type}</span>
                                <button
                                    onClick={() => removeType(type)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <Button onClick={handleSave} className="w-full gap-2">
                        <Save className="w-5 h-5" />
                        Save All Changes
                    </Button>
                </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800">
                <p className="font-bold mb-1">Notice:</p>
                <p>Adding a variety here will immediately make it available as a selection when adding or editing products.</p>
            </div>
        </div>
    );
}
