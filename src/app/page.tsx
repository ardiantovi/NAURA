'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageCircle, MapPin } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Home() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedNaura');
    if (!hasVisited) {
      setShowWelcomeModal(true);
      sessionStorage.setItem('hasVisitedNaura', 'true');
    }
  }, []);

  const phoneNumber = "6285183280606";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Halo, saya tertarik dengan produk Anda.`;
  const mapsUrl = "https://maps.app.goo.gl/GgbWLVomXgASTnu6A";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <AlertDialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <AlertDialogContent className="max-w-md text-center">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold font-headline tracking-wider">
              WELCOME TO NAURA ELECTRONIC
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Logo Section */}
          <div className="flex justify-center fade-in-up" style={{ animationDelay: '100ms' }}>
            <Card className="w-full max-w-sm aspect-square overflow-hidden rounded-3xl shadow-2xl hover:shadow-primary/20 transition-shadow duration-300">
              <CardContent className="p-0 flex items-center justify-center h-full">
                <Image
                  src="https://picsum.photos/seed/naura-logo/400/400"
                  alt="Naura Electronic Logo"
                  width={400}
                  height={400}
                  className="object-cover"
                  data-ai-hint="company logo"
                  priority
                />
              </CardContent>
            </Card>
          </div>

          {/* Links Section */}
          <div className="flex flex-col gap-6">
            <Link href="/products" passHref>
              <Button
                variant="outline"
                size="lg"
                className="w-full h-16 text-xl justify-between fade-in-up"
                style={{ animationDelay: '300ms' }}
              >
                Produk
                <ArrowRight className="h-6 w-6" />
              </Button>
            </Link>
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
      </main>

      <Footer />
    </div>
  );
}
