import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specs: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
