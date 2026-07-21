import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OnboardingAnswers = {
  // A. Account and identity
  firstName?: string;
  birthDate?: string;
  preferredUnits?: 'imperial' | 'metric';
  sexAtBirth?: 'female' | 'male' | 'intersex' | 'prefer_not_to_say';
  genderIdentity?: string;
  country?: string;
  timezone?: string;

  // B. Primary goals
  primaryGoal?: string;
  secondaryGoals: string[];
  goalMotivation?: string;
  desiredGuidanceLevel?: string;
  desiredPace?: string;

  // C. Weight-related branch
  currentWeightKg?: number;
  goalWeightKg?: number;
  goalTimelineWeeks?: number;
  previousWeightTrackingExperience?: string;
  calorieGoalsFeelSupportive?: boolean;
  weightProjectionsFeelSupportive?: boolean;

  // D. Body information
  heightCm?: number;
  pregnancyStatus?: string;

  // E. Activity
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'highly_active';
  averageDailySteps?: number;
  daysExercisedPerWeek?: number;
  typicalWorkoutMinutes?: number;
  fitnessConfidence?: string;

  // F. Workout preferences
  favoriteWorkouts: string[];
  dislikedWorkouts: string[];
  preferredIntensity?: string;
  classVsIndependent?: string;
  indoorVsOutdoor?: string;
  hasGymMembership?: boolean;
  equipmentAccess: string[];
  injuriesOrLimitations?: string;
  preferredWorkoutDays: string[];

  // G. Nutrition
  dietStyle?: string;
  allergyList: string[];
  allergies: { allergen: string; severity: 'mild' | 'moderate' | 'severe' }[];
  intolerances: string[];
  foodsAvoided: string[];
  favoriteFoods: string[];
  favoriteCuisines: string[];
  favoriteRestaurants: string[];
  mealFrequency?: number;
  cookingFrequency?: string;
  takeoutFrequency?: string;
  typicalMealBudget?: number;
  preferredDeliveryService?: string;
  showNutritionNumbers?: boolean;
  trackMacros?: boolean;
  trackCalories?: boolean;
  proteinPriority?: boolean;

  // H. Wellness concerns
  wellnessConcerns: string[];

  // I. Sleep
  averageSleepHours?: number;
  usualBedtime?: string;
  usualWakeTime?: string;
  sleepConsistency?: string;
  restfulness?: string;
  usesWearable?: boolean;
  sleepGoalHours?: number;

  // J. Mood and stress
  typicalStressLevel?: number;
  stressManagementHabits: string[];
  favoriteCalmingActivities: string[];
  meditationExperience?: string;
  checkInFrequency?: string;
  trackMoodTrends?: boolean;

  // K. Hydration
  typicalWaterIntakeMl?: number;
  waterReminderEnabled?: boolean;
  trackCaffeine?: boolean;

  // L. Supplements
  wantsSupplementReminders?: boolean;
  supplements: { name: string; dosage?: string; schedule?: string; withFood?: boolean }[];

  // M. Schedule and lifestyle
  lifestyleType?: string;
  busyPeriods?: string;
  travelFrequency?: string;
  kitchenAccess?: boolean;
  mealPlanningEffort?: string;
  locationSuggestionFrequency?: string;
  wantsCalendarIntegration?: boolean;

  // N. Connected data
  connectedProviders: string[];

  // O. Permissions
  locationPermissionGranted?: boolean;
  healthPermissionGranted?: boolean;
  notificationsPermissionGranted?: boolean;
  cameraPermissionGranted?: boolean;
  calendarPermissionGranted?: boolean;
};

const DEFAULT_ANSWERS: OnboardingAnswers = {
  secondaryGoals: [],
  favoriteWorkouts: [],
  dislikedWorkouts: [],
  equipmentAccess: [],
  preferredWorkoutDays: [],
  allergyList: [],
  allergies: [],
  intolerances: [],
  foodsAvoided: [],
  favoriteFoods: [],
  favoriteCuisines: [],
  favoriteRestaurants: [],
  wellnessConcerns: [],
  stressManagementHabits: [],
  favoriteCalmingActivities: [],
  supplements: [],
  connectedProviders: [],
};

type OnboardingState = {
  answers: OnboardingAnswers;
  lastStep: string | null;
  generatedPlan: import('@/lib/onboardingActions').GeneratedPlan | null;
  update: (patch: Partial<OnboardingAnswers>) => void;
  setLastStep: (step: string) => void;
  setGeneratedPlan: (plan: OnboardingState['generatedPlan']) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: DEFAULT_ANSWERS,
      lastStep: null,
      generatedPlan: null,
      update: (patch) => set((state) => ({ answers: { ...state.answers, ...patch } })),
      setLastStep: (step) => set({ lastStep: step }),
      setGeneratedPlan: (plan) => set({ generatedPlan: plan }),
      reset: () => set({ answers: DEFAULT_ANSWERS, lastStep: null, generatedPlan: null }),
    }),
    {
      name: 'kin-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
