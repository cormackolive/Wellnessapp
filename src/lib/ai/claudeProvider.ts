import { supabase } from '@/lib/supabase';
import type { AIProvider, ConciergeContext, ConciergeMessage, ConciergeReply, MealAnalysisResult } from './types';

export const claudeAIProvider: AIProvider = {
  async sendConciergeMessage(history, context): Promise<ConciergeReply> {
    const { data, error } = await supabase.functions.invoke('ai-concierge', {
      body: { history, context },
    });
    if (error) throw error;
    return { message: data.message as string, source: 'live' };
  },

  async analyzeMealPhoto(imageBase64, context): Promise<MealAnalysisResult> {
    const { data, error } = await supabase.functions.invoke('meal-analysis', {
      body: { imageBase64, context },
    });
    if (error) throw error;
    return { ...data, source: 'live' } as MealAnalysisResult;
  },
};
