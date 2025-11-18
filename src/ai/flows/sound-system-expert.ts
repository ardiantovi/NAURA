'use server';
/**
 * @fileOverview A sound system expert AI agent for NAURA ELECTRONIC.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SoundSystemExpertInputSchema = z.string();
const SoundSystemExpertOutputSchema = z.string();

export async function askSoundSystemExpert(question: string): Promise<string> {
    const { output } = await soundSystemExpertPrompt(question);
    return output!;
}

const soundSystemExpertPrompt = ai.definePrompt({
  name: 'soundSystemExpertPrompt',
  input: { schema: SoundSystemExpertInputSchema },
  output: { schema: SoundSystemExpertOutputSchema },
  prompt: `Anda adalah asisten AI yang ramah dan sangat berpengetahuan untuk "NAURA ELECTRONIC", sebuah toko yang berspesialisasi dalam sistem suara profesional.
Tugas Anda adalah menjawab pertanyaan pelanggan dengan akurat dan membantu.

Selalu ingat:
- Anda mewakili NAURA ELECTRONIC.
- Jawaban Anda harus ringkas, jelas, dan mudah dimengerti.
- Jika Anda tidak tahu jawabannya, katakan bahwa Anda akan mencoba mencari tahu, jangan mengarang.
- Untuk pertanyaan tentang harga atau ketersediaan stok, sarankan pelanggan untuk menghubungi langsung melalui WhatsApp atau mengunjungi toko, karena Anda tidak memiliki akses ke informasi real-time tersebut.

Pertanyaan Pelanggan: {{{prompt}}}

Jawaban Anda:`,
});
