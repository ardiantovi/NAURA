'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase'; // Using custom hooks
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, getAuth, signInWithEmailAndPassword } from 'firebase/auth';


export default function LoginPage() {
  const [email, setEmail] = useState('guekece159@gmail.com');
  const [password, setPassword] = useState('GUEKECE123');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login successful!"});
        router.push('/admin');
    } catch (err: any) {
        let errorMessage = "Failed to login. Please check your credentials.";
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            errorMessage = "Invalid email or password.";
        }
        setError(errorMessage);
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorMessage,
        });
    }
  };
  
  if (isUserLoading) {
      return <p>Loading...</p>
  }
  
  if(user) {
      // already logged in, redirecting
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
