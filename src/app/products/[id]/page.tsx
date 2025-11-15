'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  
  const productRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'products', id as string);
  }, [firestore, id]);

  const { data: product, isLoading } = useDoc<Product>(productRef);

  const phoneNumber = "6285183280606";

  if (isLoading) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                        <div className="p-4">
                            <Skeleton className="w-full aspect-video" />
                        </div>
                        <div className="p-4 md:p-8 flex flex-col">
                            <Skeleton className="h-6 w-1/4 mb-2" />
                            <Skeleton className="h-10 w-3/4 mb-2" />
                            <Skeleton className="h-6 w-1/3 mb-4" />
                            <Skeleton className="h-12 w-1/2 mb-6" />
                            <Skeleton className="h-20 w-full mb-6" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>
                </Card>
            </main>
            <Footer />
        </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const handleBuyOnWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I'm interested in buying ${product.name}.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const getImageUrl = (imageId: string) => {
    const image = PlaceHolderImages.find((img) => img.id === imageId);
    return image ? image.imageUrl : `https://picsum.photos/seed/${imageId}/800/600`;
  };
  
  const getImageHint = (imageId: string) => {
    const image = PlaceHolderImages.find((img) => img.id === imageId);
    return image ? image.imageHint : 'tech product';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {/* Image Carousel */}
            <div className="p-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images && product.images.length > 0 ? product.images.map((imgId, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg">
                        <Image
                          src={getImageUrl(imgId)}
                          alt={`${product.name} image ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-full object-cover"
                          data-ai-hint={getImageHint(imgId)}
                        />
                      </div>
                    </CarouselItem>
                  )) : (
                    <CarouselItem>
                        <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {product.images && product.images.length > 1 && (
                    <>
                        <CarouselPrevious className="left-2 hidden md:flex" />
                        <CarouselNext className="right-2 hidden md:flex" />
                    </>
                )}
              </Carousel>
            </div>

            {/* Product Info */}
            <div className="p-4 md:p-8 flex flex-col">
              <p className="text-sm font-semibold text-primary mb-1">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-base md:text-lg mb-4">{product.category}</p>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>

              <p className="text-foreground/80 leading-relaxed mb-6 flex-grow">{product.description}</p>
              
              <Separator className="my-6" />

              <Button size="lg" className="w-full" onClick={handleBuyOnWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Buy on WhatsApp
              </Button>
            </div>
          </div>

          {/* Specifications */}
          {product.specs && (
            <div className="p-4 md:p-8">
                <h2 className="text-2xl font-bold font-headline mb-4">Specifications</h2>
                <Card>
                <CardContent className="p-0">
                    <ul className="divide-y">
                    {Object.entries(product.specs).map(([key, value]) => (
                        <li key={key} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                        <span className="font-medium text-muted-foreground">{key}</span>
                        <span className="font-semibold text-left sm:text-right">{value}</span>
                        </li>
                    ))}
                    </ul>
                </CardContent>
                </Card>
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
