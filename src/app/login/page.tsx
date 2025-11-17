'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirestore } from '@/firebase';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

async function grantAdminRole(firestore: any, user: User) {
    if (!firestore || !user) return;
    const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
    await setDoc(adminRoleRef, {});
}


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Admin credentials (hardcoded for simplicity as requested)
  const ADMIN_USERNAME = 'ardiantovi';
  const ADMIN_PASSWORD = 'GUEKECE123';
  const ADMIN_EMAIL = 'guekece159@gmail.com';
  const ADMIN_EMAIL_PASSWORD = 'GUEKECE123';

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/admin');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
        setError("Firebase is not initialized.");
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firebase is not initialized. Please try again later.",
        });
        return;
    }

    setError(null);
    setIsLoading(true);

    // Check against the predefined username and password
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        setError('Invalid username or password.');
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid username or password.',
        });
        setIsLoading(false);
        return;
    }

    // If credentials are correct, try to sign in with the actual admin email
    try {
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_EMAIL_PASSWORD);
        toast({ title: "Login successful!"});
        // onAuthStateChanged will handle the redirect
    } catch (err: any) {
        // If the admin user doesn't exist in Firebase Auth, create it.
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_EMAIL_PASSWORD);
                const newUser = userCredential.user;
                
                // Grant admin role
                await grantAdminRole(firestore, newUser);
                
                toast({
                    title: "Admin Account Created",
                    description: "Initial admin setup complete. Please log in again.",
                    duration: 7000,
                });
                
            } catch (createErr: any) {
                const errorMessage = createErr.message || "An unknown error occurred during admin setup.";
                setError(errorMessage);
                toast({
                    variant: "destructive",
                    title: "Admin Setup Failed",
                    description: errorMessage,
                });
            }
        } else {
            // Handle other login errors
            const errorMessage = err.message || "An unknown error occurred during login.";
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage,
            });
        }
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isUserLoading) {
      return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <p>Loading...</p>
          </main>
          <Footer />
        </div>
      )
  }
  
  if(user) {
      return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your admin username and password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
