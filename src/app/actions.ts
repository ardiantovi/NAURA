'use server';

import { personalizedProductRecommendations, PersonalizedProductRecommendationsOutput } from "@/ai/flows/personalized-product-recommendations";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { getAdminSdks } from "@/firebase/admin";

export async function getRecommendationsAction(): Promise<PersonalizedProductRecommendationsOutput> {
  const { firestore } = getAdminSdks();
  
  // In a real app, you'd get user-specific history.
  // Here we simulate it by taking a few products from the DB.
  const productsRef = collection(firestore, "products");
  const q = query(productsRef, limit(3));
  const querySnapshot = await getDocs(q);

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
