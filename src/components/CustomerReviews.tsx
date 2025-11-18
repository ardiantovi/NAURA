'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Andi Wijaya",
    initials: "AW",
    title: "Kualitas Suara Terbaik!",
    comment: "Sound system dari Naura Electronic benar-benar mengubah pengalaman audio di studio saya. Kualitasnya jernih dan bass-nya mantap. Pelayanannya juga sangat profesional!",
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
    name: "Budi Santoso",
    initials: "BS",
    title: "Pelayanan Cepat & Handal",
    comment: "Respon cepat dan instalasi di lokasi sangat rapi. Speaker yang saya beli berfungsi sempurna untuk kafe saya. Terima kasih Naura Electronic!",
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
  return (
    <div className="w-full max-w-md mx-auto space-y-6 fade-in-up" style={{ animationDelay: '900ms' }}>
       <h2 className="text-2xl font-headline text-center text-foreground">Apa Kata Mereka?</h2>
      {reviews.map((review, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-white/10">
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
      ))}
    </div>
  );
}
