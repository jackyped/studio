// This file contains the Genkit flow for summarizing driver feedback.

'use server';

/**
 * @fileOverview A driver feedback summary AI agent.
 *
 * - driverFeedbackSummary - A function that summarizes user feedback for drivers.
 * - DriverFeedbackSummaryInput - The input type for the driverFeedbackSummary function.
 * - DriverFeedbackSummaryOutput - The return type for the driverFeedbackSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DriverFeedbackSummaryInputSchema = z.object({
  feedback: z.string().describe('A collection of user feedback for a driver.'),
});
export type DriverFeedbackSummaryInput = z.infer<typeof DriverFeedbackSummaryInputSchema>;

const DriverFeedbackSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user feedback, highlighting areas for improvement.'),
});
export type DriverFeedbackSummaryOutput = z.infer<typeof DriverFeedbackSummaryOutputSchema>;

export async function driverFeedbackSummary(input: DriverFeedbackSummaryInput): Promise<DriverFeedbackSummaryOutput> {
  return driverFeedbackSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'driverFeedbackSummaryPrompt',
  input: {schema: DriverFeedbackSummaryInputSchema},
  output: {schema: DriverFeedbackSummaryOutputSchema},
  prompt: `You are an AI assistant that summarizes user feedback for drivers.

  Please provide a concise summary of the following user feedback, highlighting areas where the driver can improve their service.

  Feedback:
  {{feedback}}
  `,
});

const driverFeedbackSummaryFlow = ai.defineFlow(
  {
    name: 'driverFeedbackSummaryFlow',
    inputSchema: DriverFeedbackSummaryInputSchema,
    outputSchema: DriverFeedbackSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
