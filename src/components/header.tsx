'use client';

import Link from 'next/link';

export default function Header() {

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-base">PILIHAN YANG TEPAT ADA DI NAURA</span>
          </Link>
          <div className="font-bold text-foreground text-base">
            TIDAK BISA COD
          </div>
        </div>
      </header>
    </>
  );
}
