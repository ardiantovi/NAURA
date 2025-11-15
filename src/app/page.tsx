'use client';

import { useState } from 'react';
import type { Category, Product } from '@/lib/types';
import { categories, products } from '@/lib/data';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Zap } from 'lucide-react';
import PersonalizedRecommendations from '@/components/personalized-recommendations';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center bg-card p-8 md:p-16 rounded-xl mb-12 shadow-md">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary mb-4 tracking-tight">
            Welcome to TechSphere Audio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            High-quality sound systems for professionals and enthusiasts.
          </p>
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
