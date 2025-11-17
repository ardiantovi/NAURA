'use client';

import { useState, useRef, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, query as firestoreQuery } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Banner {
  id: string;
  imageUrl: string;
  altText: string;
  linkUrl: string;
}

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const plugin = useRef<any>(null);

  useEffect(() => {
    plugin.current = Autoplay({ delay: 5000, stopOnInteraction: true });
    const hasVisited = sessionStorage.getItem('hasVisitedNaura');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      sessionStorage.setItem('hasVisitedNaura', 'true');
    }
  }, []);

  const firestore = useFirestore();

  // Fetch Banners
  const bannersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'banners');
  }, [firestore]);
  const { data: banners, isLoading: isLoadingBanners } = useCollection<Banner>(bannersQuery);

  // Fetch Featured Products
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return firestoreQuery(collection(firestore, 'products'), limit(6));
  }, [firestore]);
  const { data: featuredProducts, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);


  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <AlertDialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <AlertDialogContent className="max-w-md text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold font-headline tracking-wider">
              WELCOME TO NAURA ELECTRONIC
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

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

        {/* Featured Products Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-headline">Produk Unggulan</h2>
            <Button asChild variant="outline">
              <Link href="/products">
                Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
