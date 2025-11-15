'use server';

import { personalizedProductRecommendations, PersonalizedProductRecommendationsOutput } from "@/ai/flows/personalized-product-recommendations";
import { getAdminSdks } from "@/firebase/admin";
import { limit } from "firebase-admin/firestore";

export async function getRecommendationsAction(): Promise<PersonalizedProductRecommendationsOutput> {
  const { firestore } = getAdminSdks();
  
  // In a real app, you'd get user-specific history.
  // Here we simulate it by taking a few products from the DB.
  const productsRef = firestore.collection("products");
  const q = productsRef.limit(3);
  const querySnapshot = await q.get();

  const browsingHistory = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      productId: doc.id,
      productName: data.name,
      category: data.category,
    };
  });
  
  return await personalizedProductRecommendations({ browsingHistory });
}
