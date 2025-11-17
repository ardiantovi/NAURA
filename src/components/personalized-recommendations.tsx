'use client';
import { useEffect, useState } from 'react';
import {
  personalizedProductRecommendations,
  type PersonalizedProductRecommendationsOutput,
} from '@/ai/flows/personalized-product-recommendations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './product-card';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent } from './ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';
import { collection } from 'firebase/firestore';

export default function PersonalizedRecommendations() {
  const [recommendations, setRecommendations] = useState<PersonalizedProductRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const firestore = useFirestore();
  
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);
  const { data: allProducts } = useCollection<Product>(productsQuery);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Simulate browsing history by taking the first few products
      const browsingHistory = allProducts.slice(0, 3).map(product => ({
        productId: product.id,
        productName: product.name,
        category: product.category,
      }));

      personalizedProductRecommendations({ browsingHistory })
        .then(setRecommendations)
        .catch((err) => {
          console.error("Failed to get recommendations:", err);
          setRecommendations({ recommendations: [] }); // Set to empty to stop loading
        })
        .finally(() => setIsLoading(false));
    } else if (allProducts) {
      // Products loaded but are empty, so no recommendations to generate
      setIsLoading(false);
      setRecommendations({ recommendations: [] });
    }
  }, [allProducts]);

  if (!allProducts) {
    return null; // or a loading state for products
  }

  const recommendedProducts = recommendations?.recommendations.map(rec => {
    // Find the full product details from our Firestore data
    const product = allProducts.find(p => p.id === rec.productId || p.name === rec.productName);
    return product ? { ...product, reason: rec.reason } : null;
  }).filter(Boolean) as (Product & { reason: string })[] | null;


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!recommendedProducts || recommendedProducts.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {recommendedProducts.map((product) =>
          product ? (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full">
                <ProductCard product={product} recommendationReason={product.reason} />
              </div>
            </CarouselItem>
          ) : null
        )}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
