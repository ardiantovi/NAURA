'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Phone, MapPin } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { FallingStars } from '@/components/ui/falling-stars';

export default function Home() {
  const phoneNumber = "6285183280606";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Halo, saya tertarik dengan produk Anda.`;
  const mapsUrl = "https://maps.app.goo.gl/GgbWLVomXgASTnu6A";

  return (
    <div className="flex flex-col min-h-screen">
      <FallingStars />
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 z-10 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-8 h-full">
          {/* Logo Section */}
          <div className="flex justify-center animate-in animate-zoom-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
            <Image
              src="https://image2url.com/images/1763435989049-14688da4-1c6a-4bf9-95fe-1d1b6a37b35d.png"
              alt="Naura Electronic Logo"
              width={400}
              height={400}
              className="object-contain"
              data-ai-hint="company logo"
              priority
            />
          </div>

          {/* Links Section */}
          <div className="w-full max-w-md flex flex-col gap-6 overflow-hidden">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="animate-in animate-slide-in-left" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
              <Button
                size="lg"
                className="w-full h-16 text-xl justify-between bg-[#25D366] text-white hover:bg-[#25D366]/90"
              >
                ADMIN 1
                <Phone className="h-6 w-6" />
              </Button>
            </a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="animate-in animate-slide-in-right" style={{ animationDelay: '700ms', animationFillMode: 'backwards' }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-16 text-xl justify-between"
              >
                KUNJUNGI TOKO KAMI
                <MapPin className="h-6 w-6" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
