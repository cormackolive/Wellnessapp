export type NutritionSource = 'Verified' | 'Estimated' | 'Unknown';

export type MealRecommendation = {
  id: string;
  restaurantName: string;
  mealName: string;
  imageUrl?: string;
  calorieMin: number;
  calorieMax: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  price: number;
  etaMinMinutes: number;
  etaMaxMinutes: number;
  distanceMiles: number;
  rating?: number;
  dietaryLabels: string[];
  allergens: string[];
  nutritionSource: NutritionSource;
  reason: string;
  category: 'Best match' | 'Quickest' | 'Highest protein' | 'Most balanced' | 'Budget-friendly' | 'Comforting' | 'Plant-forward';
};

export type ActivityRecommendation = {
  id: string;
  venueName: string;
  className: string;
  imageUrl?: string;
  startTime: string;
  durationMinutes: number;
  distanceMiles: number;
  price: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  energyMin: number;
  energyMax: number;
  rating?: number;
  reason: string;
  category: string;
};
