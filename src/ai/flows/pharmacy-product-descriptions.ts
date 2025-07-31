// This is a server-side file.
'use server';

/**
 * @fileOverview A pharmacy product description generator.
 *
 * - generateProductDescription - A function that generates a product description from a name and keywords.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the medicine.'),
  category: z.string().describe('The category of the medicine.'),
  description: z.string().describe('A partial or complete description of the medicine to be improved.'),
  usage: z.string().describe('Partial or complete usage instructions for the medicine to be improved.'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated, professional description of the medicine.'),
  usage: z.string().describe('The generated, professional usage instructions for the medicine.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert medical copywriter for a pharmacy. Your task is to take the provided information about a medicine and expand it into a professional, clear, and fact-based description and usage instructions. Be rigorous and avoid making up information. Base your output on the provided context.

Medicine Name: {{{name}}}
Category: {{{category}}}

Current Description (to be improved/completed):
"{{description}}"

Current Usage Instructions (to be improved/completed):
"{{usage}}"

Based on the information above, please generate an improved, professional description and usage instructions.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
