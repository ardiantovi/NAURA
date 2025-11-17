'use client';

import { useState, useTransition } from 'react';
import type { Product } from '@/lib/types';
import { brands } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Annoyed, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { searchProducts } from '@/ai/flows/product-search-flow';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isSearching, startSearchTransition] = useTransition();
  const [filteredProductIds, setFilteredProductIds] = useState<string[] | null>(null);

  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery) {
        setFilteredProductIds(null); // Reset filter if search is cleared
        return;
    }

    startSearchTransition(async () => {
        if (!products) return;
        try {
            const result = await searchProducts({ query: searchQuery, products: products });
            setFilteredProductIds(result.relevantProductIds);
        } catch (error) {
            console.error("AI search failed:", error);
            setFilteredProductIds([]); // Show no results on error
        }
    });
  };

  const filteredProducts = useMemoFirebase(() => {
    if (!products) return [];

    let brandFilteredProducts = products.filter((product) => {
        const brandName = product.brand || 'Unknown';
        return selectedBrand ? brandName === selectedBrand : true;
    });

    if (filteredProductIds !== null) {
      const idSet = new Set(filteredProductIds);
      return brandFilteredProducts.filter(p => idSet.has(p.id));
    }
    
    // If no AI search has been performed, just return the brand-filtered products
    return brandFilteredProducts;

  }, [products, selectedBrand, filteredProductIds]);

  const handleResetFilters = () => {
    setSelectedBrand(null);
    setSearchQuery('');
    setFilteredProductIds(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar */}
          <aside>
            <Card className="p-6 sticky top-28">
              <h3 className="font-headline text-xl font-semibold mb-4 text-primary">MEREK</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedBrand === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedBrand(null)}
                >
                  Semua Merek
                </Button>
                {brands.map((brand) => (
                  <Button
                    key={brand.id}
                    variant={selectedBrand === brand.name ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedBrand(brand.name)}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Product Grid and Search */}
          <div>
            <form onSubmit={handleSearchSubmit}>
                <div className="flex w-full items-center space-x-2 mb-8">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Cari produk dengan AI... (cth: speaker bassnya bagus)"
                            className="w-full pl-10 text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={isSearching}>
                        {isSearching ? <Loader2 className="animate-spin" /> : 'Cari'}
                    </Button>
                </div>
            </form>
            {(isLoadingProducts || isSearching) ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-4 space-y-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                        </CardContent>
                    </Card>
                    ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <div className="flex justify-center mb-4">
                        <Annoyed className="h-12 w-12 text-muted-foreground/50"/>
                    </div>
                  <h3 className="text-xl font-semibold mb-2">Produk Tidak Ditemukan</h3>
                  <p className='mb-4'>Coba sesuaikan pencarian atau filter Anda.</p>
                  <Button onClick={handleResetFilters}>Hapus Filter</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
