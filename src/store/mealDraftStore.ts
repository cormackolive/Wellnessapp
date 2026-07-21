import { create } from 'zustand';
import type { MealAnalysisResult } from '@/lib/ai';

type MealDraftState = {
  imageBase64: string | null;
  analysis: MealAnalysisResult | null;
  setDraft: (imageBase64: string, analysis: MealAnalysisResult) => void;
  clear: () => void;
};

export const useMealDraftStore = create<MealDraftState>((set) => ({
  imageBase64: null,
  analysis: null,
  setDraft: (imageBase64, analysis) => set({ imageBase64, analysis }),
  clear: () => set({ imageBase64: null, analysis: null }),
}));
