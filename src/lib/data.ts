import type { Product, Category, Brand } from './types';
import { Speaker, Radio, Mic } from 'lucide-react';

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

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'AuraWave Pro 15"',
    description:
      'The AuraWave Pro delivers powerful, clear sound for any venue. Featuring a 15-inch woofer, titanium compression driver, and robust construction for professional use.',
    price: 499,
    category: 'Speakers',
    brand: 'ASHLEY',
    images: ['speaker-1', 'speaker-2'],
    specs: {
      'Power Handling': '1000W Peak, 250W RMS',
      'Frequency Response': '45Hz - 20kHz',
      'Driver': '15-inch Woofer',
      'Connectivity': 'XLR, 1/4" TRS',
    },
  },
  {
    id: 'prod-2',
    name: 'NexusAmp 2000',
    description:
      'Experience unmatched power and clarity with the NexusAmp 2000. Delivering 2000 watts of clean power, it is perfect for driving professional sound systems.',
    price: 799,
    category: 'Amplifiers',
    brand: 'PHASELAB',
    images: ['amplifier-1'],
    specs: {
      'Power Output': '2000W @ 4 Ohms',
      'Channels': '2',
      'Input': 'XLR, RCA',
      'Weight': '15 lbs',
    },
  },
  {
    id: 'prod-3',
    name: 'VocalPro X1',
    description:
      'Capture every nuance of your performance with the VocalPro X1. This professional dynamic microphone is ideal for live vocals and instruments.',
    price: 129,
    category: 'Microphones',
    brand: 'BETAVO',
    images: ['microphone-1'],
    specs: {
      'Type': 'Dynamic',
      'Polar Pattern': 'Cardioid',
      'Frequency Response': '50Hz - 15kHz',
      'Connector': 'XLR',
    },
  },
  {
    id: 'prod-4',
    name: 'BassCannon Sub18',
    description:
      'Feel the thunder with the BassCannon Sub18. This 18-inch active subwoofer provides deep, tight bass to fill any room.',
    price: 899,
    category: 'Speakers',
    brand: 'SPL',
    images: ['subwoofer-1'],
    specs: {
      'Power': '1200W Peak',
      'Driver': '18-inch Subwoofer',
      'Frequency Range': '30Hz - 150Hz',
      'Max SPL': '135 dB',
    },
  },
  {
    id: 'prod-5',
    name: 'StageMix 12-Channel',
    description:
      'The perfect mixing console for small bands and venues. Featuring 12 channels, built-in effects, and USB connectivity for recording.',
    price: 399,
    category: 'Amplifiers',
    brand: 'LINEAR',
    images: ['mixer-1'],
    specs: {
      'Channels': '12 (4 mic/line, 4 stereo)',
      'Effects': '16 DSP presets',
      'Interface': 'USB Audio',
      'EQ': '3-band per channel',
    },
  },
  {
    id: 'prod-6',
    name: 'SoundBar Elite',
    description:
      'Elevate your home theater experience with cinematic sound. The SoundBar Elite offers rich audio and deep bass in a sleek, easy-to-use package.',
    price: 299,
    category: 'Speakers',
    brand: 'WISDOM',
    images: ['soundbar-1'],
    specs: {
      'Channels': '3.1.2',
      'Audio': 'Dolby Atmos',
      'Connectivity': 'HDMI eARC, Bluetooth, Optical',
      'Subwoofer': 'Wireless',
    },
  },
];
