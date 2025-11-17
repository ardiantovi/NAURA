import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Lightbulb } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface ProductCardProps {
  product: Product;
  recommendationReason?: string;
}

export default function ProductCard({ product, recommendationReason }: ProductCardProps) {
  const imageUrl = product.images?.[0] || `https://picsum.photos/seed/${product.id}/600/400`;

  const phoneNumber = "6285183280606"; // Ganti dengan nomor WhatsApp Anda
  const handleBuyOnWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I'm interested in buying 1x ${product.name}.`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
       {recommendationReason && (
         <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground rounded-full p-2 cursor-pointer">
                  <Lightbulb className="h-5 w-5" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{recommendationReason}</p>
              </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}
      <CardHeader className="p-4 relative">
        <Link href={`/products/${product.id}`} className="block group">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt={product.name}
              width={600}
              height={400}
              className="object-cover w-full h-full transform transition-transform duration-500 ease-in-out group-hover:scale-110"
              data-ai-hint="tech product"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-headline font-medium mb-2 leading-tight h-10 overflow-hidden">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <p className="text-xl font-semibold text-primary">{formatRupiah(product.price)}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 p-4">
        <Button className="w-full transition-transform duration-200 hover:scale-105" onClick={handleBuyOnWhatsApp}>
            <MessageCircle className="mr-2 h-5 w-5"/>
            Buy on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
