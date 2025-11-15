'use client';

import Link from 'next/link';
import { Gem, TriangleAlert } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Gem className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl font-headline">TechSphere</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                <TriangleAlert className="h-5 w-5" />
                <span>TIDAK BISA COD!</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
