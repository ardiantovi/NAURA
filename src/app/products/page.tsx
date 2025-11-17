'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { brands } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Annoyed } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products?.filter((product) => {
    const brandName = product.brand || 'Unknown';
    const matchesBrand = selectedBrand ? brandName === selectedBrand : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  }) || [];

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
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 text-base"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {isLoadingProducts ? (
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
                  <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                  <p>Try adjusting your search or filters.</p>
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
