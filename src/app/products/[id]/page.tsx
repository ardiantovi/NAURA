'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, MessageCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const phoneNumber = "6285183280606"; // Ganti dengan nomor WhatsApp Anda

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
      `Hello, I'm interested in buying ${quantity}x ${product.name}.`
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Carousel */}
            <div className="p-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((imgId, index) => (
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
                  ))}
                </CarouselContent>
                {product.images.length > 1 && (
                    <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </>
                )}
              </Carousel>
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col">
              <p className="text-sm font-semibold text-primary mb-1">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2">{product.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{product.category}</p>
              <p className="text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>

              <p className="text-foreground/80 leading-relaxed mb-6 flex-grow">{product.description}</p>
              
              <Separator className="my-6" />

              <div className="flex items-center gap-4 mb-6">
                <p className="font-semibold">Quantity:</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    className="h-9 w-16 text-center"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleBuyOnWhatsApp}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Buy on WhatsApp
              </Button>
            </div>
          </div>

          {/* Specifications */}
          <div className="p-8">
            <h2 className="text-2xl font-bold font-headline mb-4">Specifications</h2>
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-center p-4">
                      <span className="font-medium text-muted-foreground">{key}</span>
                      <span className="font-semibold text-right">{value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
