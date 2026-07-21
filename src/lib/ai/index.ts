import type { AIProvider, ConciergeContext, ConciergeMessage, MealAnalysisResult } from './types';
import { claudeAIProvider } from './claudeProvider';
import { mockAIProvider } from './mockProvider';

export * from './types';

/**
 * Falls back to the mock provider whenever the live edge function isn't
 * deployed yet or a request fails, so the concierge always responds.
 */
export const aiProvider: AIProvider = {
  async sendConciergeMessage(history: ConciergeMessage[], context: ConciergeContext) {
    try {
      return await claudeAIProvider.sendConciergeMessage(history, context);
    } catch (err) {
      if (__DEV__) console.warn('[ai] live concierge unavailable, using mock provider:', err);
      return mockAIProvider.sendConciergeMessage(history, context);
    }
  },

  async analyzeMealPhoto(imageBase64: string, context: ConciergeContext): Promise<MealAnalysisResult> {
    try {
      return await claudeAIProvider.analyzeMealPhoto(imageBase64, context);
    } catch (err) {
      if (__DEV__) console.warn('[ai] live meal analysis unavailable, using mock provider:', err);
      return mockAIProvider.analyzeMealPhoto(imageBase64, context);
    }
  },
};
