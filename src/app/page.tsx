'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageCircle, MapPin } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { FallingStars } from '@/components/ui/falling-stars';
import { CustomerReviews } from '@/components/CustomerReviews';


export default function Home() {
  const phoneNumber = "6285183280606";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Halo, saya tertarik dengan produk Anda.`;
  const mapsUrl = "https://maps.app.goo.gl/GgbWLVomXgASTnu6A";

  return (
    <div className="flex flex-col min-h-screen">
      <FallingStars />
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center h-full">
          <div className="flex flex-col items-center justify-center gap-8">
            {/* Logo Section */}
            <div className="flex justify-center fade-in-up" style={{ animationDelay: '100ms' }}>
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
            <div className="w-full max-w-md flex flex-col gap-6">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-16 text-xl justify-between fade-in-up"
                  style={{ animationDelay: '500ms' }}
                >
                  HUBUNGI KAMI DI WHATSAPP
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </a>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-16 text-xl justify-between fade-in-up"
                  style={{ animationDelay: '700ms' }}
                >
                  KUNJUNGI TOKO KAMI
                  <MapPin className="h-6 w-6" />
                </Button>
              </a>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col justify-center h-full">
            <CustomerReviews />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
