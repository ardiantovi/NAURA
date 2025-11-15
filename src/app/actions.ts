'use server';

import { personalizedProductRecommendations, PersonalizedProductRecommendationsOutput } from "@/ai/flows/personalized-product-recommendations";
import { products } from "@/lib/data";

export async function getRecommendationsAction(): Promise<PersonalizedProductRecommendationsOutput> {
  // Simulate browsing history by taking the first 3 products
  const browsingHistory = products.slice(0, 3).map((p) => ({
    productId: p.id,
    productName: p.name,
    category: p.category,
  }));
  return await personalizedProductRecommendations({ browsingHistory });
}
