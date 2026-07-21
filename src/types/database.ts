export type PreferredUnits = 'imperial' | 'metric';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'highly_active';

export type Profile = {
  id: string;
  first_name: string | null;
  birth_date: string | null;
  sex_at_birth: 'female' | 'male' | 'intersex' | 'prefer_not_to_say' | null;
  gender_identity: string | null;
  height_cm: number | null;
  preferred_units: PreferredUnits;
  country: string | null;
  locale: string | null;
  timezone: string | null;
  primary_goal: string | null;
  secondary_goals: string[];
  goal_weight_kg: number | null;
  goal_timeline_weeks: number | null;
  activity_level: ActivityLevel | null;
  show_calories: boolean;
  show_macros: boolean;
  show_weight: boolean;
  show_weight_projection: boolean;
  show_kin_score: boolean;
  track_mood: boolean;
  track_water: boolean;
  track_supplements: boolean;
  track_sleep: boolean;
  track_workouts: boolean;
  location_opt_in: boolean;
  onboarding_completed: boolean;
  onboarding_step: string | null;
  created_at: string;
  updated_at: string;
};

export type DietaryPreference = {
  id: string;
  user_id: string;
  diet_style: string | null;
  favorite_cuisines: string[];
  favorite_foods: string[];
  favorite_restaurants: string[];
  foods_avoided: string[];
  meal_frequency: number | null;
  cooking_frequency: string | null;
  takeout_frequency: string | null;
  typical_meal_budget: number | null;
  preferred_delivery_service: string | null;
  show_nutrition_numbers: boolean;
  track_macros: boolean;
  track_calories: boolean;
  protein_priority: boolean;
};

export type Allergy = {
  id: string;
  user_id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | null;
};

export type WorkoutPreference = {
  id: string;
  user_id: string;
  favorite_workouts: string[];
  disliked_workouts: string[];
  preferred_intensity: string | null;
  class_vs_independent: string | null;
  indoor_vs_outdoor: string | null;
  has_gym_membership: boolean | null;
  equipment_access: string[] | null;
  typical_workout_minutes: number | null;
  injuries_or_limitations: string | null;
  preferred_workout_days: string[] | null;
};

export type HealthConnection = {
  id: string;
  user_id: string;
  provider: 'apple_health' | 'oura' | 'whoop' | 'garmin' | 'fitbit' | 'strava' | 'health_connect' | 'calendar';
  connected: boolean;
  last_synced_at: string | null;
};

export type DailyTarget = {
  id: string;
  user_id: string;
  effective_date: string;
  energy_kcal_min: number | null;
  energy_kcal_max: number | null;
  protein_g_min: number | null;
  protein_g_max: number | null;
  carbs_g_min: number | null;
  carbs_g_max: number | null;
  fat_g_min: number | null;
  fat_g_max: number | null;
  fiber_g: number | null;
  water_ml: number | null;
  step_target: number | null;
  workout_frequency_per_week: number | null;
  sleep_hours_min: number | null;
  sleep_hours_max: number | null;
};

export type DailySummary = {
  id: string;
  user_id: string;
  summary_date: string;
  kin_score: number | null;
  nourish_score: number | null;
  move_score: number | null;
  hydrate_score: number | null;
  restore_score: number | null;
  calm_score: number | null;
};

export type Meal = {
  id: string;
  user_id: string;
  eaten_at: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  image_path: string | null;
  source: 'manual' | 'photo' | 'barcode' | 'restaurant' | 'natural_language' | 'saved';
  restaurant_id: string | null;
  verified_nutrition: boolean;
  calorie_min: number | null;
  calorie_max: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  sugar_g: number | null;
  sodium_mg: number | null;
  confidence: 'low' | 'moderate' | 'high' | null;
  notes: string | null;
  created_at: string;
};

export type WaterEntry = {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  workout_type_id: string | null;
  source: string;
  started_at: string;
  duration_minutes: number | null;
  energy_kcal_min: number | null;
  energy_kcal_max: number | null;
  notes: string | null;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood: string;
  stress_level: number | null;
  context_tags: string[];
  note: string | null;
  created_at: string;
};

export type SleepEntry = {
  id: string;
  user_id: string;
  source: string;
  sleep_start: string | null;
  sleep_end: string | null;
  duration_minutes: number | null;
  restfulness: number | null;
};

export type WeightEntry = {
  id: string;
  user_id: string;
  weight_kg: number;
  note: string | null;
  logged_at: string;
};

export type Supplement = {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  schedule: string | null;
  with_food: boolean | null;
  reminder_enabled: boolean;
  reminder_time: string | null;
};

export type CalmSession = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  duration_seconds: number;
  description: string | null;
};

export type CalmSessionLog = {
  id: string;
  user_id: string;
  calm_session_id: string;
  completed: boolean;
  post_feeling: 'Calmer' | 'About the same' | 'More energized' | 'Still overwhelmed' | null;
  created_at: string;
};

export type Insight = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  evidence_summary: string | null;
  confidence: 'low' | 'moderate' | 'high' | null;
  created_at: string;
  dismissed_at: string | null;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: 'free' | 'monthly' | 'annual';
  status: 'active' | 'trialing' | 'canceled' | 'expired';
  provider: 'mock' | 'revenuecat';
  current_period_end: string | null;
};

export type NotificationPreferences = {
  id: string;
  user_id: string;
  water: boolean;
  meals: boolean;
  movement: boolean;
  sleep: boolean;
  supplements: boolean;
  calm: boolean;
  nearby_recommendations: boolean;
  weekly_review: boolean;
  connected_device_status: boolean;
};
