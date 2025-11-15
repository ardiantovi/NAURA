'use client';

import { useState, useRef } from 'react';
import type { Category, Product } from '@/lib/types';
import { categories, products, brands } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Zap, Annoyed } from 'lucide-react';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import { Separator } from '@/components/ui/separator';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const plugin = useRef(
    Autoplay({ delay: 10000, stopOnInteraction: true })
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBrand && matchesSearch;
  });

  const heroSlides = [
    {
      title: 'Selamat Datang di TechSphere Audio',
      description: 'Sistem suara berkualitas tinggi untuk para profesional dan penggemar.',
      bgColor: 'bg-card',
    },
    {
      title: 'Diskon Akhir Pekan!',
      description: 'Dapatkan diskon 15% untuk semua speaker ASHLEY. Hanya akhir pekan ini!',
      bgColor: 'bg-primary',
      textColor: 'text-primary-foreground',
    },
    {
      title: 'Pengiriman Gratis',
      description: 'Nikmati pengiriman gratis untuk pesanan di atas $500.',
      bgColor: 'bg-accent',
      textColor: 'text-accent-foreground',
    },
    {
        title: 'Produk Baru: VocalPro X1',
        description: 'Tangkap setiap nuansa penampilan Anda. Ideal untuk vokal live dan instrumen.',
        bgColor: 'bg-secondary',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                {heroSlides.map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className={`text-center p-8 md:p-16 rounded-xl shadow-md ${slide.bgColor} ${slide.textColor || ''}`}>
                            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight">
                                {slide.title}
                            </h1>
                            <p className={`text-lg md:text-xl ${slide.textColor ? '' : 'text-muted-foreground'} max-w-3xl mx-auto`}>
                                {slide.description}
                            </p>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
        </section>

        {/* Main Content */}
        <div className="grid md:grid-cols-[280px_1fr] gap-12">
          {/* Sidebar */}
          <aside>
            <Card className="p-6 sticky top-28">
              <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Categories</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </div>

              <Separator className="my-6" />

              <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Brands</h3>
              <div className="space-y-2">
                <Button
                  variant={selectedBrand === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedBrand(null)}
                >
                  All Brands
                </Button>
                {brands.map((brand) => (
                  <Button
                    key={brand.id}
                    variant={selectedBrand === brand.name ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedBrand(brand.name)}
                  >
                    {brand.name}
                  </Button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Product Grid and Search */}
          <div>
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 text-base"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <div className="flex justify-center mb-4">
                        <Annoyed className="h-12 w-12 text-muted-foreground/50"/>
                    </div>
                  <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                  <p>Try adjusting your search or filters.</p>
                </CardContent>
              </Card>
            )}

            {/* Personalized Recommendations */}
            <section className="mt-16">
              <div className="flex items-center mb-6">
                <Zap className="h-7 w-7 text-primary mr-3" />
                <h2 className="text-3xl font-bold font-headline">Just For You</h2>
              </div>
              <PersonalizedRecommendations />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
