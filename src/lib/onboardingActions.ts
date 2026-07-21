import { supabase } from './supabase';
import type { OnboardingAnswers } from '@/store/onboardingStore';
import { calculateEnergyTarget, calculateMacroRanges, calculateWaterTargetMl } from '@/utils/targets';

function ageFromBirthDate(birthDate?: string): number {
  if (!birthDate) return 30; // reasonable fallback so calculations still run
  const parts = birthDate.split('/');
  if (parts.length !== 3) return 30;
  const [month, day, year] = parts.map(Number);
  const dob = new Date(year, (month || 1) - 1, day || 1);
  if (Number.isNaN(dob.getTime())) return 30;
  const diffMs = Date.now() - dob.getTime();
  return Math.max(13, Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000)));
}

export type GeneratedPlan = {
  energyMin: number;
  energyMax: number;
  proteinGMin: number;
  proteinGMax: number;
  carbsGMin: number;
  carbsGMax: number;
  fatGMin: number;
  fatGMax: number;
  fiberG: number;
  waterMl: number;
  safetyAdjusted: boolean;
  safetyMessage?: string;
};

export function generatePlanFromAnswers(answers: OnboardingAnswers): GeneratedPlan {
  const sexAtBirth = answers.sexAtBirth ?? 'prefer_not_to_say';
  const ageYears = ageFromBirthDate(answers.birthDate);
  const heightCm = answers.heightCm ?? 165;
  const weightKg = answers.currentWeightKg ?? 68;
  const activityLevel = answers.activityLevel ?? 'moderately_active';

  const goalDirection = answers.primaryGoal?.includes('Lose weight')
    ? 'lose'
    : answers.primaryGoal?.includes('Gain weight') || answers.primaryGoal?.includes('Build muscle')
      ? 'gain'
      : 'maintain';

  const energy = calculateEnergyTarget({
    sexAtBirth,
    ageYears,
    heightCm,
    weightKg,
    activityLevel,
    goalDirection,
    goalWeightKg: answers.goalWeightKg,
    goalTimelineWeeks: answers.goalTimelineWeeks,
  });

  const macros = calculateMacroRanges(energy.energyMax, weightKg, Boolean(answers.proteinPriority));
  const waterMl = answers.typicalWaterIntakeMl ?? calculateWaterTargetMl(weightKg, activityLevel);

  return {
    energyMin: energy.energyMin,
    energyMax: energy.energyMax,
    proteinGMin: macros.proteinGMin,
    proteinGMax: macros.proteinGMax,
    carbsGMin: macros.carbsGMin,
    carbsGMax: macros.carbsGMax,
    fatGMin: macros.fatGMin,
    fatGMax: macros.fatGMax,
    fiberG: macros.fiberG,
    waterMl,
    safetyAdjusted: energy.safetyAdjusted,
    safetyMessage: energy.safetyMessage,
  };
}

export async function completeOnboarding(userId: string, answers: OnboardingAnswers, plan: GeneratedPlan) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const profileUpdate = {
    first_name: answers.firstName ?? null,
    birth_date: parseBirthDateToISO(answers.birthDate),
    sex_at_birth: answers.sexAtBirth ?? null,
    gender_identity: answers.genderIdentity ?? null,
    height_cm: answers.heightCm ?? null,
    preferred_units: answers.preferredUnits ?? 'imperial',
    country: answers.country ?? null,
    timezone,
    primary_goal: answers.primaryGoal ?? null,
    secondary_goals: answers.secondaryGoals,
    goal_weight_kg: answers.goalWeightKg ?? null,
    goal_timeline_weeks: answers.goalTimelineWeeks ?? null,
    activity_level: answers.activityLevel ?? null,
    show_calories: answers.showNutritionNumbers !== false && answers.trackCalories !== false,
    show_macros: answers.showNutritionNumbers !== false && answers.trackMacros !== false,
    show_weight: answers.calorieGoalsFeelSupportive !== false,
    show_weight_projection: Boolean(answers.weightProjectionsFeelSupportive),
    track_mood: true,
    track_water: true,
    track_supplements: Boolean(answers.wantsSupplementReminders),
    track_sleep: true,
    track_workouts: true,
    location_opt_in: Boolean(answers.locationPermissionGranted),
    onboarding_completed: true,
  };

  const { error: profileError } = await supabase.from('profiles').update(profileUpdate).eq('id', userId);
  if (profileError) throw profileError;

  const { error: dietaryError } = await supabase.from('dietary_preferences').insert({
    user_id: userId,
    diet_style: answers.dietStyle ?? null,
    favorite_cuisines: answers.favoriteCuisines,
    favorite_foods: answers.favoriteFoods,
    favorite_restaurants: answers.favoriteRestaurants,
    foods_avoided: answers.foodsAvoided,
    meal_frequency: answers.mealFrequency ?? null,
    cooking_frequency: answers.cookingFrequency ?? null,
    takeout_frequency: answers.takeoutFrequency ?? null,
    typical_meal_budget: answers.typicalMealBudget ?? null,
    show_nutrition_numbers: answers.showNutritionNumbers !== false,
    track_macros: answers.trackMacros !== false,
    track_calories: answers.trackCalories !== false,
    protein_priority: Boolean(answers.proteinPriority),
  });
  if (dietaryError) throw dietaryError;

  if (answers.allergyList.length > 0) {
    const { error: allergyError } = await supabase.from('allergies').insert(
      answers.allergyList.map((allergen) => ({ user_id: userId, allergen, severity: 'moderate' as const }))
    );
    if (allergyError) throw allergyError;
  }

  const { error: workoutPrefError } = await supabase.from('workout_preferences').insert({
    user_id: userId,
    favorite_workouts: answers.favoriteWorkouts,
    disliked_workouts: answers.dislikedWorkouts,
    preferred_intensity: answers.preferredIntensity ?? null,
    class_vs_independent: answers.classVsIndependent ?? null,
    indoor_vs_outdoor: answers.indoorVsOutdoor ?? null,
    has_gym_membership: answers.hasGymMembership ?? null,
    equipment_access: answers.equipmentAccess,
    typical_workout_minutes: answers.typicalWorkoutMinutes ?? null,
    injuries_or_limitations: answers.injuriesOrLimitations ?? null,
    preferred_workout_days: answers.preferredWorkoutDays,
  });
  if (workoutPrefError) throw workoutPrefError;

  const { error: targetsError } = await supabase.from('daily_targets').insert({
    user_id: userId,
    energy_kcal_min: plan.energyMin,
    energy_kcal_max: plan.energyMax,
    protein_g_min: plan.proteinGMin,
    protein_g_max: plan.proteinGMax,
    carbs_g_min: plan.carbsGMin,
    carbs_g_max: plan.carbsGMax,
    fat_g_min: plan.fatGMin,
    fat_g_max: plan.fatGMax,
    fiber_g: plan.fiberG,
    water_ml: plan.waterMl,
    step_target: 8000,
    workout_frequency_per_week: answers.daysExercisedPerWeek ?? 3,
    sleep_hours_min: (answers.sleepGoalHours ?? 8) - 0.5,
    sleep_hours_max: (answers.sleepGoalHours ?? 8) + 0.5,
  });
  if (targetsError) throw targetsError;

  if (answers.currentWeightKg) {
    await supabase.from('weight_entries').insert({ user_id: userId, weight_kg: answers.currentWeightKg });
  }

  await supabase
    .from('notification_preferences')
    .update({ nearby_recommendations: answers.locationSuggestionFrequency !== 'Rarely' })
    .eq('user_id', userId);
}

function parseBirthDateToISO(birthDate?: string): string | null {
  if (!birthDate) return null;
  const parts = birthDate.split('/');
  if (parts.length !== 3) return null;
  const [month, day, year] = parts.map(Number);
  if (!month || !day || !year) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
