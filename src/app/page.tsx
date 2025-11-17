'use client';

import { useState, useRef, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { brands } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Zap, Annoyed } from 'lucide-react';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Banner {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const plugin = useRef<any>(null);

  useEffect(() => {
    plugin.current = Autoplay({ delay: 5000, stopOnInteraction: true });
  }, []);

  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const bannersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'banners');
  }, [firestore]);


  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  const { data: banners, isLoading: isLoadingBanners } = useCollection<Banner>(bannersQuery);

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
        {/* Hero Section */}
        <section className="mb-12">
            <Carousel
                plugins={plugin.current ? [plugin.current] : []}
                className="w-full"
                onMouseEnter={() => plugin.current?.stop()}
                onMouseLeave={() => plugin.current?.reset()}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                {isLoadingBanners ? (
                  <CarouselItem>
                    <Skeleton className="w-full aspect-[2/1] md:aspect-[3/1] rounded-xl" />
                  </CarouselItem>
                ) : (
                  banners?.map((banner, index) => (
                    <CarouselItem key={banner.id}>
                      <Link href={banner.linkUrl} passHref>
                        <Card className="overflow-hidden relative w-full aspect-[2/1] md:aspect-[3/1] flex items-center justify-center text-center bg-card text-card-foreground">
                            <Image
                                src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `https://picsum.photos/seed/${banner.imageUrl}/1200/400`}
                                alt={banner.altText}
                                fill
                                className="object-cover"
                                data-ai-hint="promotional banner"
                            />
                             <div className="absolute inset-0 bg-black/50" />
                             <div className={cn("relative z-10 p-8 fade-in-up")} style={{ animationDelay: `${index * 100}ms` }}>
                                <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white">
                                    {banner.altText}
                                </h1>
                            </div>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))
                )}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
            </Carousel>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar */}
          <aside>
            <Card className="p-6 sticky top-28">
              <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Brands</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedBrand === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedBrand(null)}
                >
                  All Brands
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

            {/* Personalized Recommendations */}
            <section className="mt-16">
              <div className="flex items-center mb-6">
                <Zap className="h-7 w-7 text-primary mr-3" />
                <h2 className="text-3xl font-bold font-headline">Just For You</h2>
              </div>
              <PersonalizedRecommendations />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
