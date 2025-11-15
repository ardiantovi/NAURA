// src/ai/flows/personalized-product-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized product recommendations based on user browsing history.
 *
 * - personalizedProductRecommendations - A function that generates personalized product recommendations.
 * - PersonalizedProductRecommendationsInput - The input type for the personalizedProductRecommendations function.
 * - PersonalizedProductRecommendationsOutput - The return type for the personalizedProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedProductRecommendationsInputSchema = z.object({
  browsingHistory: z.array(
    z.object({
      productId: z.string().describe('The ID of the product viewed.'),
      productName: z.string().describe('The name of the product viewed.'),
      category: z.string().describe('The category of the product viewed.'),
    })
  ).describe('The user browsing history, as a list of products.'),
});
export type PersonalizedProductRecommendationsInput = z.infer<typeof PersonalizedProductRecommendationsInputSchema>;

const PersonalizedProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      productId: z.string().describe('The ID of the recommended product.'),
      productName: z.string().describe('The name of the recommended product.'),
      category: z.string().describe('The category of the recommended product.'),
      reason: z.string().describe('The reason why the product is recommended.'),
    })
  ).describe('A list of personalized product recommendations.'),
});
export type PersonalizedProductRecommendationsOutput = z.infer<typeof PersonalizedProductRecommendationsOutputSchema>;

export async function personalizedProductRecommendations(input: PersonalizedProductRecommendationsInput): Promise<PersonalizedProductRecommendationsOutput> {
  return personalizedProductRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedProductRecommendationsPrompt',
  input: {schema: PersonalizedProductRecommendationsInputSchema},
  output: {schema: PersonalizedProductRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce product recommender.

  Based on the user's browsing history, provide personalized product recommendations.
  Explain the reason for each recommendation.

  User's Browsing History:
  {{#each browsingHistory}}
  - Product ID: {{this.productId}}, Product Name: {{this.productName}}, Category: {{this.category}}
  {{/each}}
  `,
});

const personalizedProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedProductRecommendationsFlow',
    inputSchema: PersonalizedProductRecommendationsInputSchema,
    outputSchema: PersonalizedProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
