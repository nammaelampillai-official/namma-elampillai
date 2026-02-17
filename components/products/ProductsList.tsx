'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/Button';
import { type Product } from '@/lib/dataStore';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

interface ProductsListProps {
    initialProducts: Product[];
    initialSareeTypes: string[];
}

export default function ProductsList({ initialProducts, initialSareeTypes }: ProductsListProps) {
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

    // Filters & Sorting State
    const [selectedType, setSelectedType] = useState(searchParams.get('material') || 'All');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    const minPrice = searchParams.get('min') ? parseInt(searchParams.get('min')!) : 0;
    const maxPrice = searchParams.get('max') ? parseInt(searchParams.get('max')!) : Infinity;

    useEffect(() => {
        let result = [...initialProducts];

        // Filter by Type
        if (selectedType !== 'All') {
            result = result.filter(p => p.material === selectedType);
        }

        // Filter by Price Range (from URL)
        result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);

        // Sorting
        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else {
            // Newest first (assuming _id or default order is newest)
            result.sort((a, b) => {
                const dateA = a._id.length > 15 ? parseInt(a._id.substring(0, 8), 16) : 0;
                const dateB = b._id.length > 15 ? parseInt(b._id.substring(0, 8), 16) : 0;
                return dateB - dateA;
            });
        }

        setFilteredProducts(result);
    }, [initialProducts, selectedType, sortBy, minPrice, maxPrice]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-heritage-maroon">Our Collections</h1>
                    <p className="text-gray-500 mt-2">Discover the finest sarees from Elampillai</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showFilters ? 'bg-heritage-maroon text-white border-heritage-maroon' : 'bg-white text-gray-700 border-gray-200'}`}
                    >
                        <Filter className="w-4 h-4" /> Filters
                    </button>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
                        <span className="text-sm font-medium text-gray-500 ml-3">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-sm font-semibold text-gray-800 focus:outline-none px-2 py-1.5 cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters - Desktop */}
                <aside className={`md:block w-full md:w-64 space-y-8 ${showFilters ? 'block' : 'hidden'}`}>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-heritage-maroon" />
                                Categories
                            </h3>
                            {selectedType !== 'All' && (
                                <button
                                    onClick={() => setSelectedType('All')}
                                    className="text-xs text-heritage-maroon hover:underline font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedType('All')}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${selectedType === 'All' ? 'bg-heritage-maroon text-white font-bold shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                All Sarees
                            </button>
                            {initialSareeTypes.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${selectedType === type ? 'bg-heritage-maroon text-white font-bold shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:block bg-heritage-maroon p-6 rounded-2xl text-white">
                        <h4 className="font-serif font-bold text-xl mb-2">Need Help?</h4>
                        <p className="text-heritage-cream/70 text-sm mb-4">Can't find what you're looking for? Contact us for custom orders.</p>
                        <Link href="/pages/contact">
                            <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-heritage-maroon">
                                Enquire Now
                            </Button>
                        </Link>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No sarees found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or search to find what you're looking for.</p>
                            <Button
                                variant="outline"
                                className="mt-6 border-heritage-maroon text-heritage-maroon"
                                onClick={() => {
                                    setSelectedType('All');
                                    setSortBy('newest');
                                }}
                            >
                                Reset All Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
