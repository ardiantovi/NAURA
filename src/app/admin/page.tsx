'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Box, Image as ImageIcon } from 'lucide-react';

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/admin/products" passHref>
            <Card className="hover:bg-card/95 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Manage Products</CardTitle>
                <Box className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Add, edit, or delete products from your store.</p>
                <div className="flex items-center text-primary font-semibold">
                  Go to Products <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/banners" passHref>
            <Card className="hover:bg-card/95 hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Manage Banners</CardTitle>
                <ImageIcon className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Update the promotional banners on your homepage.</p>
                 <div className="flex items-center text-primary font-semibold">
                  Go to Banners <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
