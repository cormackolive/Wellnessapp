import type { ActivityRecommendation, MealRecommendation } from '@/types/discover';

export type NearbySearchContext = {
  latitude?: number;
  longitude?: number;
  budget?: number;
  minutesAvailable?: number;
  allergies?: string[];
  favoriteCuisines?: string[];
  remainingCalorieMin?: number;
  remainingCalorieMax?: number;
  remainingProteinG?: number;
  needsRecovery?: boolean;
  preferredWorkoutTypes?: string[];
  injuriesOrLimitations?: string;
};

export interface PlacesProvider {
  searchNearbyMeals(context: NearbySearchContext): Promise<MealRecommendation[]>;
  searchNearbyActivities(context: NearbySearchContext): Promise<ActivityRecommendation[]>;
}
