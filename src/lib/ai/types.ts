export type ConciergeMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ConciergeContext = {
  firstName?: string;
  primaryGoal?: string;
  remainingCalories?: { min: number; max: number };
  remainingProteinG?: number;
  mood?: string;
  stressLevel?: number;
  sleepHours?: number;
  locationLabel?: string;
  budget?: number;
  minutesAvailable?: number;
  allergies?: string[];
  showCalories?: boolean;
  showWeight?: boolean;
};

export type ConciergeReply = {
  message: string;
  source: 'live' | 'mock';
};

export type MealAnalysisResult = {
  identifiedFoods: string[];
  calorieMin: number;
  calorieMax: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  confidence: 'low' | 'moderate' | 'high';
  source: 'live' | 'mock';
};

export interface AIProvider {
  sendConciergeMessage(
    history: ConciergeMessage[],
    context: ConciergeContext
  ): Promise<ConciergeReply>;

  analyzeMealPhoto(imageBase64: string, context: ConciergeContext): Promise<MealAnalysisResult>;
}
