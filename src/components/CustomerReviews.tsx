'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

const reviews = [
  {
    name: "Budi Santoso",
    initials: "BS",
    title: "Pelayanan Cepat & Handal",
    comment: "Respon cepat dan instalasi di lokasi sangat rapi. Speaker yang saya beli berfungsi sempurna untuk kafe saya. Terima kasih Naura Electronic!",
    rating: 5,
  },
  {
    name: "Rina Amelia",
    initials: "RA",
    title: "Respon Super Cepat!",
    comment: "Butuh sound system mendadak untuk acara kantor, langsung hubungi Naura Electronic. Dalam hitungan jam semua sudah siap terpasang. Benar-benar penyelamat!",
    rating: 5,
  },
  {
    name: "Siti Lestari",
    initials: "SL",
    title: "Sangat Direkomendasikan",
    comment: "Saya menyewa sound system untuk acara pernikahan saya dan hasilnya luar biasa. Tim Naura sangat membantu dari awal sampai akhir. Tamu-tamu semua puas!",
    rating: 5,
  },
  {
    name: "Joko Susilo",
    initials: "JS",
    title: "Konsultasi Terbaik & Cepat",
    comment: "Saya awam soal audio, tapi tim Naura sabar banget menjelaskan dan merekomendasikan paket yang pas. Prosesnya cepat dan tidak ribet sama sekali. Pelayanan bintang lima!",
    rating: 5,
  },
  {
    name: "Andi Wijaya",
    initials: "AW",
    title: "Kualitas Suara Terbaik!",
    comment: "Sound system dari Naura Electronic benar-benar mengubah pengalaman audio di studio saya. Kualitasnya jernih dan bass-nya mantap. Pelayanannya juga sangat profesional!",
    rating: 5,
  },
  {
    name: "Dewi Kartika",
    initials: "DK",
    title: "Pengiriman Tepat Waktu",
    comment: "Pesan beberapa set speaker, barang datang sesuai jadwal dan dalam kondisi sempurna. Koordinasi timnya sangat baik dan cepat. Sangat memuaskan.",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-accent fill-accent" : "text-muted-foreground/50"}`}
      />
    ))}
  </div>
);

export function CustomerReviews() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <div className="w-full h-full max-w-md mx-auto flex flex-col fade-in-up" style={{ animationDelay: '900ms' }}>
      <h2 className="text-2xl font-headline text-center text-foreground mb-6">Apa Kata Mereka?</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        orientation="vertical"
        plugins={[plugin.current]}
        className="w-full flex-grow overflow-hidden"
      >
        <CarouselContent className="-mt-4 h-full">
          {[...reviews, ...reviews].map((review, index) => (
            <CarouselItem key={index} className="pt-4 basis-1/3">
              <Card className="bg-card/50 backdrop-blur-sm border-white/10 h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{review.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold">{review.name}</CardTitle>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">&quot;{review.comment}&quot;</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}