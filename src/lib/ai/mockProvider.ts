import type { AIProvider, ConciergeContext, ConciergeMessage, ConciergeReply, MealAnalysisResult } from './types';

function craftMockReply(history: ConciergeMessage[], context: ConciergeContext): string {
  const lastUserMessage = [...history].reverse().find((m) => m.role === 'user')?.content.toLowerCase() ?? '';

  if (lastUserMessage.includes('stress') || lastUserMessage.includes('overwhelm')) {
    return "You reported feeling stressed. A one-minute extended-exhale reset might help before you decide anything else — it takes less time than reading this reply.";
  }

  if (lastUserMessage.includes('protein')) {
    const remaining = context.remainingProteinG ?? 32;
    return `You have about ${remaining}g of protein remaining today. Two nearby options fit well: a chicken shawarma bowl that can arrive in about 25 minutes, or a tofu rice bowl with a bit more fiber.`;
  }

  if (lastUserMessage.includes('tired') || lastUserMessage.includes('sleep')) {
    return "You slept less than usual. A lighter training option or a short walk may feel better today than a heavy session — recovery is part of the plan, not a break from it.";
  }

  if (lastUserMessage.includes('order') || lastUserMessage.includes('eat') || lastUserMessage.includes('food')) {
    const cal = context.remainingCalories;
    const calText = cal ? `you have roughly ${cal.min}–${cal.max} kcal remaining today` : 'based on your remaining targets';
    return `Based on where you are today, ${calText}. A Mediterranean grain bowl or a miso tofu bowl both fit well nearby — want details on either?`;
  }

  return "Tell me what you're working with right now — how much time you have, how you're feeling, or what you're craving — and I'll find something realistic that fits.";
}

export const mockAIProvider: AIProvider = {
  async sendConciergeMessage(history, context): Promise<ConciergeReply> {
    await new Promise((r) => setTimeout(r, 350));
    return { message: craftMockReply(history, context), source: 'mock' };
  },

  async analyzeMealPhoto(_imageBase64, _context): Promise<MealAnalysisResult> {
    await new Promise((r) => setTimeout(r, 900));
    return {
      identifiedFoods: ['Grilled chicken', 'Mixed greens', 'Roasted sweet potato', 'Olive oil dressing'],
      calorieMin: 520,
      calorieMax: 640,
      proteinG: 34,
      carbsG: 48,
      fatG: 22,
      fiberG: 8,
      confidence: 'moderate',
      source: 'mock',
    };
  },
};
