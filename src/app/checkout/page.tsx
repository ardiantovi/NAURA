import Header from '@/components/header';
import Footer from '@/components/footer';
import { CheckoutForm } from './checkout-form';
import { OrderSummary } from './order-summary';
import { Card } from '@/components/ui/card';

export default function CheckoutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
            Checkout
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Complete your purchase
          </p>
        </div>
        <div className="grid md:grid-cols-2 md:gap-12 gap-8">
          <Card className="p-8">
            <CheckoutForm />
          </Card>
          <div className="row-start-1 md:row-auto">
             <Card className="p-8 sticky top-28">
              <OrderSummary />
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
