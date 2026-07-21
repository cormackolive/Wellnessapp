export type MealScoringInput = {
  proteinG: number;
  remainingProteinG?: number;
  calorieMin: number;
  calorieMax: number;
  remainingCalorieMin?: number;
  remainingCalorieMax?: number;
  favoriteCuisineMatch: boolean;
  distanceMiles: number;
  price: number;
  budget?: number;
  isOpen: boolean;
  hasAllergenConflict: boolean;
  nutritionConfidence: 'low' | 'moderate' | 'high';
  pastPositiveFeedback: boolean;
};

export type WorkoutScoringInput = {
  goalFit: number; // 0-1, how well the activity type matches stated preferences
  isLowIntensity: boolean;
  userNeedsRecovery: boolean; // elevated stress or poor sleep
  preferenceMatch: boolean;
  durationFitsAvailableTime: boolean;
  distanceMiles: number;
  price: number;
  budget?: number;
  weatherSuitable: boolean;
  conflictsWithLimitation: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Weighted scoring per the Kin recommendation spec:
 * goal fit 25%, diet/allergy fit is a hard gate, remaining-nutrition fit 20%,
 * preference fit 15%, distance/time 10%, budget 10%, availability 10%,
 * nutrition confidence 5%, past feedback 5%.
 */
export function scoreMealRecommendation(input: MealScoringInput): number {
  if (input.hasAllergenConflict || !input.isOpen) return 0;

  const goalFit = input.proteinG >= 25 ? 1 : 0.5;

  const remainingFit =
    input.remainingCalorieMin !== undefined && input.remainingCalorieMax !== undefined
      ? clamp01(
          1 -
            Math.abs(
              (input.calorieMin + input.calorieMax) / 2 -
                (input.remainingCalorieMin + input.remainingCalorieMax) / 2
            ) /
              1000
        )
      : 0.6;

  const preferenceFit = input.favoriteCuisineMatch ? 1 : 0.4;
  const distanceFit = clamp01(1 - input.distanceMiles / 5);
  const budgetFit = input.budget ? clamp01(1 - Math.max(0, input.price - input.budget) / input.budget) : 0.7;
  const availabilityFit = input.isOpen ? 1 : 0;
  const confidenceFit = { low: 0.3, moderate: 0.7, high: 1 }[input.nutritionConfidence];
  const feedbackFit = input.pastPositiveFeedback ? 1 : 0.5;

  return (
    goalFit * 0.25 +
    remainingFit * 0.2 +
    preferenceFit * 0.15 +
    distanceFit * 0.1 +
    budgetFit * 0.1 +
    availabilityFit * 0.1 +
    confidenceFit * 0.05 +
    feedbackFit * 0.05
  );
}

export function scoreWorkoutRecommendation(input: WorkoutScoringInput): number {
  if (input.conflictsWithLimitation) return 0;

  const recoveryFit = input.userNeedsRecovery ? (input.isLowIntensity ? 1 : 0.3) : 0.7;
  const moodFit = input.userNeedsRecovery ? (input.isLowIntensity ? 1 : 0.4) : 0.7;
  const preferenceFit = input.preferenceMatch ? 1 : 0.4;
  const timeFit = input.durationFitsAvailableTime ? 1 : 0.3;
  const distanceFit = clamp01(1 - input.distanceMiles / 5);
  const budgetFit = input.budget ? clamp01(1 - Math.max(0, input.price - input.budget) / (input.budget || 1)) : 0.7;
  const weatherFit = input.weatherSuitable ? 1 : 0.5;

  return (
    input.goalFit * 0.2 +
    recoveryFit * 0.2 +
    moodFit * 0.15 +
    preferenceFit * 0.15 +
    timeFit * 0.1 +
    distanceFit * 0.1 +
    budgetFit * 0.05 +
    weatherFit * 0.05
  );
}
