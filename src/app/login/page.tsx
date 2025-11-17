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
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

async function grantAdminRole(firestore: any, user: User) {
    if (!firestore || !user) return;
    const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
    // This will now succeed because of the new security rule.
    await setDoc(adminRoleRef, {});
}


export default function LoginPage() {
  const [email, setEmail] = useState('guekece159@gmail.com');
  const [password, setPassword] = useState('GUEKECE123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

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

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Login successful!"});
        router.push('/admin');
    } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            // User does not exist, let's create a new admin account
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;
                
                // CRITICAL: Grant admin role and WAIT for it to complete
                await grantAdminRole(firestore, newUser);
                
                toast({
                    title: "Admin Account Created",
                    description: "Your admin account has been created. Redirecting to dashboard...",
                });
                
                // The onAuthStateChanged listener will handle the redirect
                // but we can push it manually to be sure.
                router.push('/admin');

            } catch (createErr: any) {
                const errorMessage = createErr.message || "An unknown error occurred during sign up.";
                setError(errorMessage);
                toast({
                    variant: "destructive",
                    title: "Sign Up Failed",
                    description: errorMessage,
                });
            }
        } else {
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
  
  if (isUserLoading || isLoading) {
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
            <CardDescription>Enter your credentials to access the admin panel. If the account doesn't exist, an admin account will be created for you.</CardDescription>
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
                {isLoading ? 'Processing...' : 'Login or Create Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}