import { supabase } from '@/lib/supabase';
import { scoreMealRecommendation, scoreWorkoutRecommendation } from '@/utils/recommendationEngine';
import type { ActivityRecommendation, MealRecommendation } from '@/types/discover';
import type { NearbySearchContext, PlacesProvider } from './types';

function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Default reference point (used when the user hasn't granted location access).
const DEFAULT_LAT = 37.7775;
const DEFAULT_LON = -122.4194;

export const mockPlacesProvider: PlacesProvider = {
  async searchNearbyMeals(context: NearbySearchContext): Promise<MealRecommendation[]> {
    const lat = context.latitude ?? DEFAULT_LAT;
    const lon = context.longitude ?? DEFAULT_LON;

    const { data, error } = await supabase
      .from('restaurant_menu_items')
      .select('*, restaurants(id, name, latitude, longitude, rating)')
      .limit(50);

    if (error || !data) return [];

    const allergies = (context.allergies ?? []).map((a) => a.toLowerCase());

    const scored = data.map((item: any) => {
      const restaurant = item.restaurants;
      const distanceMiles = restaurant?.latitude
        ? Math.round(haversineMiles(lat, lon, restaurant.latitude, restaurant.longitude) * 10) / 10
        : 1.0;
      const hasAllergenConflict = (item.allergens ?? []).some((a: string) => allergies.includes(a.toLowerCase()));
      const favoriteCuisineMatch = (context.favoriteCuisines ?? []).length === 0;

      const score = scoreMealRecommendation({
        proteinG: item.protein_g ?? 0,
        remainingProteinG: context.remainingProteinG,
        calorieMin: item.calorie_min ?? 0,
        calorieMax: item.calorie_max ?? 0,
        remainingCalorieMin: context.remainingCalorieMin,
        remainingCalorieMax: context.remainingCalorieMax,
        favoriteCuisineMatch,
        distanceMiles,
        price: item.price ?? 0,
        budget: context.budget,
        isOpen: true,
        hasAllergenConflict,
        nutritionConfidence: 'moderate',
        pastPositiveFeedback: false,
      });

      const reason =
        item.protein_g >= 35
          ? 'One of the strongest nearby matches for your remaining protein target.'
          : 'A balanced option that fits your remaining nutrition range and is close by.';

      const rec: MealRecommendation = {
        id: item.id,
        restaurantName: restaurant?.name ?? 'Nearby restaurant',
        mealName: item.name,
        calorieMin: item.calorie_min,
        calorieMax: item.calorie_max,
        protein: item.protein_g,
        carbs: item.carbs_g,
        fat: item.fat_g,
        fiber: item.fiber_g,
        price: item.price,
        etaMinMinutes: 18 + Math.round(distanceMiles * 6),
        etaMaxMinutes: 28 + Math.round(distanceMiles * 6),
        distanceMiles,
        rating: restaurant?.rating,
        dietaryLabels: item.dietary_labels ?? [],
        allergens: item.allergens ?? [],
        nutritionSource: (item.nutrition_source ?? 'estimated') as MealRecommendation['nutritionSource'],
        reason,
        category: item.protein_g >= 35 ? 'Highest protein' : 'Best match',
      };

      return { rec, score, hasAllergenConflict };
    });

    return scored
      .filter((s) => !s.hasAllergenConflict)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.rec);
  },

  async searchNearbyActivities(context: NearbySearchContext): Promise<ActivityRecommendation[]> {
    const lat = context.latitude ?? DEFAULT_LAT;
    const lon = context.longitude ?? DEFAULT_LON;

    const { data, error } = await supabase
      .from('activity_classes')
      .select('*, activity_venues(id, name, latitude, longitude)')
      .limit(50);

    if (error || !data) return [];

    const scored = data.map((item: any) => {
      const venue = item.activity_venues;
      const distanceMiles = venue?.latitude
        ? Math.round(haversineMiles(lat, lon, venue.latitude, venue.longitude) * 10) / 10
        : 0.8;
      const isLowIntensity = item.difficulty === 'Beginner';
      const preferenceMatch =
        (context.preferredWorkoutTypes ?? []).length === 0 ||
        (context.preferredWorkoutTypes ?? []).some((t) => item.category?.includes(t.toLowerCase()));
      const durationFitsAvailableTime = context.minutesAvailable ? item.duration_minutes <= context.minutesAvailable : true;
      const conflictsWithLimitation = Boolean(
        context.injuriesOrLimitations && item.category === 'running' && context.injuriesOrLimitations.toLowerCase().includes('knee')
      );

      const score = scoreWorkoutRecommendation({
        goalFit: 0.8,
        isLowIntensity,
        userNeedsRecovery: Boolean(context.needsRecovery),
        preferenceMatch,
        durationFitsAvailableTime,
        distanceMiles,
        price: item.price ?? 0,
        budget: context.budget,
        weatherSuitable: true,
        conflictsWithLimitation,
      });

      const reason = context.needsRecovery
        ? 'You reported elevated stress or lower sleep, so Kin prioritized a gentler option.'
        : 'This fits your available time and preferred activity style.';

      const rec: ActivityRecommendation = {
        id: item.id,
        venueName: venue?.name ?? 'Nearby studio',
        className: item.name,
        startTime: item.starts_at
          ? new Date(item.starts_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
          : 'Today',
        durationMinutes: item.duration_minutes,
        distanceMiles,
        price: item.price,
        difficulty: item.difficulty,
        energyMin: item.energy_kcal_min,
        energyMax: item.energy_kcal_max,
        rating: item.rating,
        reason,
        category: item.category,
      };

      return { rec, score, conflictsWithLimitation };
    });

    return scored
      .filter((s) => !s.conflictsWithLimitation)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.rec);
  },
};
