'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { getMediaLibrary, addMediaFile, deleteMediaFile, type MediaFile } from '@/lib/dataStore';

export default function MediaLibraryPage() {
    const [media, setMedia] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = () => {
        setLoading(true);
        const data = getMediaLibrary();
        setMedia(data);
        setLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Convert to data URL for storage
                const reader = new FileReader();
                const result = await new Promise<string>((resolve) => {
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });

                addMediaFile({
                    filename: file.name,
                    path: result,
                    size: file.size
                });
            }
            loadMedia();
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (confirm(`Delete "${name}"? This cannot be undone.`)) {
            deleteMediaFile(id);
            loadMedia();
        }
    };

    const copyToClipboard = (path: string, id: string) => {
        navigator.clipboard.writeText(path);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Media Library</h1>
                    <p className="text-gray-500">Manage your images and assets</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        id="mediaUpload"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <Label
                        htmlFor="mediaUpload"
                        className="flex items-center gap-2 cursor-pointer bg-heritage-maroon text-white px-4 py-2 rounded-lg hover:bg-heritage-maroon/90 transition-colors"
                    >
                        {uploading ? (
                            <span className="animate-pulse">Uploading...</span>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload Assets
                            </>
                        )}
                    </Label>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading library...</div>
            ) : media.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-20 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No images yet</h3>
                    <p className="text-gray-500 mb-6">Upload images to use them in your products and content</p>
                    <Label
                        htmlFor="mediaUpload"
                        className="text-heritage-maroon font-medium cursor-pointer hover:underline"
                    >
                        Click to upload
                    </Label>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {media.map((file) => (
                        <div key={file.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square relative bg-gray-100 p-2">
                                <Image
                                    src={file.path}
                                    alt={file.filename}
                                    fill
                                    className="object-contain"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                                    <button
                                        onClick={() => copyToClipboard(file.path, file.id)}
                                        className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                                        title="Copy Link"
                                    >
                                        {copiedId === file.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.id, file.filename)}
                                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-900 truncate" title={file.filename}>
                                    {file.filename}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
