'use server';
/**
 * @fileOverview A smart product search AI flow.
 *
 * - searchProducts - A function that handles the product search process.
 * - ProductSearchInput - The input type for the searchProducts function.
 * - ProductSearchOutput - The return type for the searchProducts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Product } from '@/lib/types';


// Define the schema for the list of products passed to the flow.
// We are re-defining a simplified Product schema here for Genkit.
const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    brand: z.string(),
    specs: z.record(z.string()).optional(),
});


const ProductSearchInputSchema = z.object({
  query: z.string().describe("The user's natural language search query."),
  products: z.array(ProductSchema).describe('The list of all available products to search from.'),
});
export type ProductSearchInput = z.infer<typeof ProductSearchInputSchema>;

const ProductSearchOutputSchema = z.object({
  relevantProductIds: z
    .array(z.string())
    .describe('An array of product IDs that best match the user query.'),
});
export type ProductSearchOutput = z.infer<typeof ProductSearchOutputSchema>;

export async function searchProducts(
  input: ProductSearchInput
): Promise<ProductSearchOutput> {
  return productSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productSearchPrompt',
  input: { schema: ProductSearchInputSchema },
  output: { schema: ProductSearchOutputSchema },
  prompt: `You are an expert product search engine for an electronics store specializing in professional audio equipment.
Your task is to analyze the user's search query and return a list of product IDs that are the most relevant.

User's search query: "{{query}}"

Analyze the user's intent. Are they looking for a specific brand, a feature, a price range, or a type of product?
For example, if they say "bass-nya bagus" (good bass), they are likely looking for subwoofers or speakers known for good low-frequency response.
If they mention a brand like "Ashley", filter by that brand.

Here is the complete list of available products in JSON format:
{{{json products}}}

Based on your analysis, return an array of product IDs that best match the query.
If no products are a good match, return an empty array.
Only return the product IDs.
`,
});

const productSearchFlow = ai.defineFlow(
  {
    name: 'productSearchFlow',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async input => {
    // The prompt is powerful enough to handle the logic.
    // We just pass the input to the prompt and return the output.
    const { output } = await prompt(input);
    return output!;
  }
);
