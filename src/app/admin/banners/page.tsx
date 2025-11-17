'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';
import Header from '@/components/header';
import Footer from '@/components/footer';
import BannerManager from '@/components/admin/banner-manager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminBannersPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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
        <div className="flex items-center mb-6">
          <Button asChild variant="outline" size="sm" className="mr-4">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <BannerManager />
      </main>
      <Footer />
    </div>
  );
}
