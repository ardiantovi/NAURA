import Link from 'next/link';
import { MapPin, MessageCircle } from 'lucide-react';

export default function Footer() {
  const phoneNumber = "6285183280606";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-6 gap-6">
        <p className="text-center sm:text-left text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NAURA ELECTRONIC. All Rights Reserved.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                <MessageCircle className="h-4 w-4" />
                <span>+{phoneNumber}</span>
            </Link>
            <Link
            href="https://maps.app.goo.gl/GgbWLVomXgASTnu6A"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
            <MapPin className="h-4 w-4" />
            <span>Temukan kami di Google Maps</span>
            </Link>
        </div>
      </div>
    </footer>
  );
}
