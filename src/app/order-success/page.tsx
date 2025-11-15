import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardTitle className="text-3xl font-headline">Thank You For Your Order!</CardTitle>
            <p className="text-muted-foreground">
              Your order has been placed successfully. You will receive an email confirmation shortly.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
