import { scoreMealRecommendation, scoreWorkoutRecommendation } from '../recommendationEngine';

describe('scoreMealRecommendation', () => {
  const base = {
    proteinG: 40,
    calorieMin: 500,
    calorieMax: 600,
    favoriteCuisineMatch: true,
    distanceMiles: 1,
    price: 15,
    isOpen: true,
    hasAllergenConflict: false,
    nutritionConfidence: 'high' as const,
    pastPositiveFeedback: true,
  };

  it('hard-excludes a meal with an allergen conflict regardless of fit', () => {
    const score = scoreMealRecommendation({ ...base, hasAllergenConflict: true });
    expect(score).toBe(0);
  });

  it('hard-excludes a closed restaurant', () => {
    const score = scoreMealRecommendation({ ...base, isOpen: false });
    expect(score).toBe(0);
  });

  it('scores a high-protein, nearby, in-budget meal higher than a distant mismatch', () => {
    const strong = scoreMealRecommendation(base);
    const weak = scoreMealRecommendation({
      ...base,
      proteinG: 8,
      favoriteCuisineMatch: false,
      distanceMiles: 4.5,
      pastPositiveFeedback: false,
      nutritionConfidence: 'low',
    });
    expect(strong).toBeGreaterThan(weak);
  });

  it('returns a score between 0 and 1 for a valid candidate', () => {
    const score = scoreMealRecommendation(base);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe('scoreWorkoutRecommendation', () => {
  const base = {
    goalFit: 0.8,
    isLowIntensity: false,
    userNeedsRecovery: false,
    preferenceMatch: true,
    durationFitsAvailableTime: true,
    distanceMiles: 1,
    price: 20,
    weatherSuitable: true,
    conflictsWithLimitation: false,
  };

  it('hard-excludes an activity that conflicts with a stated limitation', () => {
    const score = scoreWorkoutRecommendation({ ...base, conflictsWithLimitation: true });
    expect(score).toBe(0);
  });

  it('favors low-intensity options when the user needs recovery', () => {
    const gentle = scoreWorkoutRecommendation({ ...base, userNeedsRecovery: true, isLowIntensity: true });
    const intense = scoreWorkoutRecommendation({ ...base, userNeedsRecovery: true, isLowIntensity: false });
    expect(gentle).toBeGreaterThan(intense);
  });
});
