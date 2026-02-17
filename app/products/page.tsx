import { Suspense } from 'react';
import ProductsList from '@/components/products/ProductsList';
import { getProductsServer, getSiteContentServer } from '@/lib/server/data';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const products = await getProductsServer();
    const content = await getSiteContentServer();
    const sareeTypes = content.sareeTypes || [];

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-serif text-heritage-maroon">Loading our collection...</div>}>
            <ProductsList initialProducts={products} initialSareeTypes={sareeTypes} />
        </Suspense>
    );
}
