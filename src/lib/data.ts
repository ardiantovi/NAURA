import type { Product, Category, Brand } from './types';
import { Speaker, Radio, Mic } from 'lucide-react';

// This file is now deprecated for products, but we'll keep categories and brands for now.
// Product data will be fetched from Firestore.

export const categories: Category[] = [
  { id: 'cat-1', name: 'Speakers', icon: Speaker },
  { id: 'cat-2', name: 'Amplifiers', icon: Radio },
  { id: 'cat-3', name: 'Microphones', icon: Mic },
];

export const brands: Brand[] = [
    { id: 'brand-1', name: 'ASHLEY' },
    { id: 'brand-2', name: 'BETAVO' },
    { id: 'brand-3', name: 'PHASELAB' },
    { id: 'brand-4', name: 'SPL' },
    { id: 'brand-5', name: 'WISDOM' },
    { id: 'brand-6', name: 'LINEAR' },
    { id: 'brand-7', name: 'ACR' },
    { id: 'brand-8', name: 'FEST' },
];

export const products: Product[] = []; // This will be populated from Firestore
