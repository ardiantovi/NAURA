import type { Product, Category } from './types';
import { Laptop, Smartphone, Headphones, Watch, Camera, Tablet, Wind, Bot } from 'lucide-react';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Laptops', icon: Laptop },
  { id: 'cat-2', name: 'Smartphones', icon: Smartphone },
  { id: 'cat-3', name: 'Headphones', icon: Headphones },
  { id: 'cat-4', name: 'Smartwatches', icon: Watch },
  { id: 'cat-5', name: 'Cameras', icon: Camera },
  { id: 'cat-6', name: 'Tablets', icon: Tablet },
  { id: 'cat-7', name: 'Drones', icon: Wind },
  { id: 'cat-8', name: 'VR', icon: Bot },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'AuraBook Pro 14"',
    description:
      'The new AuraBook Pro pushes the boundaries of performance. Featuring the revolutionary M3 chip, a stunning Liquid Retina XDR display, and all-day battery life.',
    price: 1599,
    category: 'Laptops',
    images: ['laptop-1', 'laptop-2'],
    specs: {
      Chip: 'Aura M3',
      Display: '14.2-inch Liquid Retina XDR',
      Memory: '16GB Unified Memory',
      Storage: '512GB SSD',
    },
  },
  {
    id: 'prod-2',
    name: 'NexusPhone X',
    description:
      'Experience the future of mobile with the NexusPhone X. A brilliant ProMotion display, a cinematic camera system, and the fastest chip ever in a smartphone.',
    price: 999,
    category: 'Smartphones',
    images: ['phone-1', 'phone-2'],
    specs: {
      Chip: 'Bionic A17',
      Display: '6.7-inch Super Retina XDR',
      Camera: '48MP Main, 12MP Ultra Wide',
      Storage: '256GB',
    },
  },
  {
    id: 'prod-3',
    name: 'SoundWave Elite',
    description:
      'Immerse yourself in pure sound with SoundWave Elite headphones. Industry-leading noise cancellation, high-resolution audio, and a comfortable, lightweight design.',
    price: 349,
    category: 'Headphones',
    images: ['headphones-1', 'headphones-2'],
    specs: {
      'Noise Cancellation': 'Active Noise Cancellation',
      'Playtime': 'Up to 30 hours',
      'Connectivity': 'Bluetooth 5.2',
      'Driver': '40mm Dynamic',
    },
  },
  {
    id: 'prod-4',
    name: 'ChronoWatch Series 9',
    description:
      'The ultimate device for a healthy life. The ChronoWatch Series 9 features advanced health sensors, a brighter display, and powerful new fitness features.',
    price: 399,
    category: 'Smartwatches',
    images: ['smartwatch-1', 'smartwatch-2'],
    specs: {
      'Health Sensors': 'ECG, Blood Oxygen',
      'Display': 'Always-On Retina Display',
      'Water Resistance': '50 meters',
      'Connectivity': 'GPS + Cellular',
    },
  },
  {
    id: 'prod-5',
    name: 'LuminaShot Pro',
    description:
      'Capture your world like never before with the LuminaShot Pro. A full-frame sensor, advanced autofocus, and 4K video recording in a compact body.',
    price: 1999,
    category: 'Cameras',
    images: ['camera-1', 'camera-2'],
    specs: {
      'Sensor': '33MP Full-Frame CMOS',
      'Autofocus': 'Hybrid AF with Eye Detection',
      'Video': '4K 60p',
      'Lens Mount': 'Universal E-Mount',
    },
  },
  {
    id: 'prod-6',
    name: 'ZenithPad Air',
    description:
      'Light, bright, and full of might. The ZenithPad Air features a stunning Liquid Retina display, the powerful M2 chip, and support for the Pro Pencil.',
    price: 599,
    category: 'Tablets',
    images: ['tablet-1'],
    specs: {
      'Chip': 'Aura M2',
      'Display': '10.9-inch Liquid Retina',
      'Compatibility': 'Pro Pencil, Magic Keyboard',
      'Storage': '128GB',
    },
  },
  {
    id: 'prod-7',
    name: 'AeroDrone 4K',
    description:
      'See the world from a new perspective. The AeroDrone 4K offers a 3-axis gimbal, 30-minute flight time, and stunning 4K HDR video.',
    price: 799,
    category: 'Drones',
    images: ['drone-1'],
    specs: {
      'Video Resolution': '4K HDR',
      'Flight Time': '31 minutes',
      'Range': '10km',
      'Gimbal': '3-axis stabilization',
    },
  },
  {
    id: 'prod-8',
    name: 'MindScape VR',
    description:
      'Step into new realities with MindScape VR. High-resolution displays, intuitive controllers, and a vast library of immersive experiences await.',
    price: 499,
    category: 'VR',
    images: ['vr-1'],
    specs: {
      'Display': '4K Fast-Switch LCD',
      'Tracking': '6DoF Inside-Out',
      'Audio': 'Integrated 3D Spatial Audio',
      'Field of View': '110 degrees',
    },
  },
];
