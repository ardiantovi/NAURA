'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase'; // Using the custom hook
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Admin Panel</CardTitle>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          </CardHeader>
          <CardContent>
            <p>Welcome, {user.email}! This is where you'll manage products and banners.</p>
            {/* TODO: Add product and banner management UI */}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
