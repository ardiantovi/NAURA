'use client';

import Link from 'next/link';
import { ShoppingCart, Gem } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState, useEffect } from 'react';

export default function Header() {
  const { getCartItemCount } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemCount = isClient ? getCartItemCount() : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Gem className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl font-headline">TechSphere</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSheetOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Open cart</span>
            </Button>
          </div>
        </div>
      </header>
      <CartSheet open={isSheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}
