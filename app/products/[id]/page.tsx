import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { ShoppingCart, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    await dbConnect();
    try {
        const product = await Product.findById(id).lean();
        if (!product) return null;
        return JSON.parse(JSON.stringify(product));
    } catch (e) {
        return null;
    }
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-heritage-gold/20">
                    {product.images && product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-center">
                    {product.isVerified && (
                        <div className="mb-4">
                            <Badge variant="verified" className="px-3 py-1 text-sm gap-1 inline-flex">
                                <ShieldCheck className="w-4 h-4" />
                                Verified Elampillai Weaver
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1 ml-1">
                                Sourced directly from verified master weavers.
                            </p>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-heritage-maroon mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold text-gray-900 mb-6">₹{product.price.toLocaleString('en-IN')}</p>

                    <div className="prose prose-stone mb-8">
                        <h3 className="font-bold text-lg mb-2">Description</h3>
                        <p>{product.description}</p>

                        <h3 className="font-bold text-lg mt-4 mb-2">Material</h3>
                        <p>{product.material}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="flex-1 w-full gap-2 bg-heritage-maroon text-heritage-gold border border-heritage-gold hover:bg-heritage-maroon/90">
                            <ShoppingCart className="w-5 h-5" />
                            Add to Cart
                        </Button>
                        <Button size="lg" variant="secondary" className="flex-1 w-full">
                            Buy Now
                        </Button>
                    </div>

                    <div className="mt-8 p-4 bg-heritage-cream/20 rounded-lg border border-heritage-gold/20 text-sm text-gray-600">
                        <p className="font-semibold mb-1">Authenticity Guaranteed</p>
                        <p>This product is fulfilled by Namma Elampillai's managed logistics to ensure quality.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
