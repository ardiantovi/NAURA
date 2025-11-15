'use client';

import { useCart } from '@/hooks/use-cart';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function OrderSummary() {
  const { cartItems, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 10.00 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  const getImageUrl = (imageId: string) => {
    const image = PlaceHolderImages.find((img) => img.id === imageId);
    return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/100/100';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-headline font-semibold">Order Summary</h2>
      
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.product.id} className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md border">
              <Image 
                src={getImageUrl(item.product.images[0])}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
               <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {item.quantity}
              </span>
            </div>
            <div className="flex-grow">
              <p className="font-medium">{item.product.name}</p>
            </div>
            <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <Separator />

      <div className="space-y-2 text-muted-foreground">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      
      <Separator />

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
