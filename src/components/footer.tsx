import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-6 gap-4">
        <p className="text-center sm:text-left text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} NAURA ELECTRONIC. All Rights Reserved.
        </p>
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
    </footer>
  );
}
