'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images`);
            return;
        }

        setUploading(true);

        try {
            const newImages: string[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Check for file size
                if (file.size > 2 * 1024 * 1024) {
                    alert(`Image "${file.name}" is too large (over 2MB). Please use a compressed image.`);
                    continue;
                }

                // Create a local URL for the image
                const reader = new FileReader();
                const imageUrl = await new Promise<string>((resolve) => {
                    reader.onload = (e) => {
                        resolve(e.target?.result as string);
                    };
                    reader.readAsDataURL(file);
                });

                newImages.push(imageUrl);
            }

            onChange([...images, ...newImages]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* Upload Button */}
            {images.length < maxImages && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full gap-2"
                    >
                        <Upload className="w-5 h-5" />
                        {uploading ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                        Supported formats: JPG, PNG, WebP. Max {maxImages} images.
                    </p>
                </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={image}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                    Main Image
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
