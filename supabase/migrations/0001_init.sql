-- Kin core schema
-- Every user-owned table is scoped by user_id = auth.uid() via row-level security.

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================================
-- PROFILE + PREFERENCES
-- =========================================================================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  birth_date date,
  sex_at_birth text check (sex_at_birth in ('female', 'male', 'intersex', 'prefer_not_to_say')),
  gender_identity text,
  height_cm numeric,
  preferred_units text not null default 'imperial' check (preferred_units in ('imperial', 'metric')),
  country text,
  locale text,
  timezone text,
  primary_goal text,
  secondary_goals text[] default '{}',
  goal_weight_kg numeric,
  goal_timeline_weeks integer,
  activity_level text check (activity_level in ('sedentary', 'lightly_active', 'moderately_active', 'highly_active')),
  show_calories boolean not null default true,
  show_macros boolean not null default true,
  show_weight boolean not null default true,
  show_weight_projection boolean not null default false,
  show_kin_score boolean not null default true,
  track_mood boolean not null default true,
  track_water boolean not null default true,
  track_supplements boolean not null default false,
  track_sleep boolean not null default true,
  track_workouts boolean not null default true,
  location_opt_in boolean not null default false,
  onboarding_completed boolean not null default false,
  onboarding_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at before update on profiles
  for each row execute function set_updated_at();

create table dietary_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  diet_style text,
  favorite_cuisines text[] default '{}',
  favorite_foods text[] default '{}',
  favorite_restaurants text[] default '{}',
  foods_avoided text[] default '{}',
  meal_frequency integer,
  cooking_frequency text,
  takeout_frequency text,
  typical_meal_budget numeric,
  preferred_delivery_service text,
  show_nutrition_numbers boolean not null default true,
  track_macros boolean not null default true,
  track_calories boolean not null default true,
  protein_priority boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger dietary_preferences_set_updated_at before update on dietary_preferences
  for each row execute function set_updated_at();

create table allergies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  allergen text not null,
  severity text check (severity in ('mild', 'moderate', 'severe')),
  created_at timestamptz not null default now()
);

create table workout_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  favorite_workouts text[] default '{}',
  disliked_workouts text[] default '{}',
  preferred_intensity text,
  class_vs_independent text,
  indoor_vs_outdoor text,
  has_gym_membership boolean,
  equipment_access text[],
  typical_workout_minutes integer,
  injuries_or_limitations text,
  preferred_workout_days text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger workout_preferences_set_updated_at before update on workout_preferences
  for each row execute function set_updated_at();

create table health_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('apple_health', 'oura', 'whoop', 'garmin', 'fitbit', 'strava', 'health_connect', 'calendar')),
  connected boolean not null default false,
  last_synced_at timestamptz,
  scopes text[] default '{}',
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

-- =========================================================================
-- TARGETS + DAILY SUMMARY
-- =========================================================================

create table daily_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  effective_date date not null default current_date,
  energy_kcal_min integer,
  energy_kcal_max integer,
  protein_g_min integer,
  protein_g_max integer,
  carbs_g_min integer,
  carbs_g_max integer,
  fat_g_min integer,
  fat_g_max integer,
  fiber_g integer,
  water_ml integer,
  step_target integer,
  workout_frequency_per_week integer,
  sleep_hours_min numeric,
  sleep_hours_max numeric,
  created_at timestamptz not null default now()
);

create table daily_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  summary_date date not null,
  kin_score integer,
  nourish_score integer,
  move_score integer,
  hydrate_score integer,
  restore_score integer,
  calm_score integer,
  created_at timestamptz not null default now(),
  unique (user_id, summary_date)
);

-- =========================================================================
-- NUTRITION
-- =========================================================================

create table restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cuisine text,
  address text,
  latitude numeric,
  longitude numeric,
  price_level integer,
  rating numeric,
  is_mock boolean not null default true,
  created_at timestamptz not null default now()
);

create table restaurant_menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  description text,
  image_url text,
  price numeric,
  calorie_min integer,
  calorie_max integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  dietary_labels text[] default '{}',
  allergens text[] default '{}',
  nutrition_source text not null default 'estimated' check (nutrition_source in ('verified', 'estimated', 'unknown')),
  created_at timestamptz not null default now()
);

create table meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  eaten_at timestamptz not null default now(),
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  image_path text,
  source text not null default 'manual' check (source in ('manual', 'photo', 'barcode', 'restaurant', 'natural_language', 'saved')),
  restaurant_id uuid references restaurants(id),
  verified_nutrition boolean not null default false,
  calorie_min integer,
  calorie_max integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  sugar_g numeric,
  sodium_mg numeric,
  confidence text check (confidence in ('low', 'moderate', 'high')),
  notes text,
  created_at timestamptz not null default now()
);

create table meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references meals(id) on delete cascade,
  name text not null,
  quantity text,
  calorie_min integer,
  calorie_max integer,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  created_at timestamptz not null default now()
);

create table saved_meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_template jsonb not null,
  created_at timestamptz not null default now()
);

create table favorite_restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, restaurant_id)
);

create table water_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml integer not null,
  logged_at timestamptz not null default now()
);

create table supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  dosage text,
  schedule text,
  with_food boolean,
  reminder_enabled boolean not null default false,
  reminder_time time,
  created_at timestamptz not null default now()
);

create table supplement_logs (
  id uuid primary key default gen_random_uuid(),
  supplement_id uuid not null references supplements(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_at timestamptz not null default now()
);

-- =========================================================================
-- MOVEMENT
-- =========================================================================

create table workout_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text
);

create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_type_id uuid references workout_types(id),
  source text not null default 'manual' check (source in ('manual', 'apple_health', 'oura', 'whoop', 'garmin', 'fitbit', 'strava', 'health_connect')),
  started_at timestamptz not null default now(),
  duration_minutes integer,
  energy_kcal_min integer,
  energy_kcal_max integer,
  notes text,
  created_at timestamptz not null default now()
);

create table activity_venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  latitude numeric,
  longitude numeric,
  is_mock boolean not null default true,
  created_at timestamptz not null default now()
);

create table activity_classes (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references activity_venues(id) on delete cascade,
  name text not null,
  category text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  duration_minutes integer,
  price numeric,
  starts_at timestamptz,
  energy_kcal_min integer,
  energy_kcal_max integer,
  rating numeric,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- WELLNESS: MOOD, SLEEP, WEIGHT, CALM
-- =========================================================================

create table mood_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null,
  stress_level integer check (stress_level between 1 and 5),
  context_tags text[] default '{}',
  note text,
  created_at timestamptz not null default now()
);

create table sleep_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'manual' check (source in ('manual', 'apple_health', 'oura', 'whoop', 'garmin', 'fitbit', 'health_connect')),
  sleep_start timestamptz,
  sleep_end timestamptz,
  duration_minutes integer,
  restfulness integer check (restfulness between 1 and 5),
  created_at timestamptz not null default now()
);

create table weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  note text,
  logged_at timestamptz not null default now()
);

create table body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measurement_type text not null,
  value numeric not null,
  unit text not null,
  logged_at timestamptz not null default now()
);

create table calm_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text,
  duration_seconds integer not null,
  description text
);

create table calm_session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  calm_session_id uuid not null references calm_sessions(id),
  completed boolean not null default true,
  post_feeling text check (post_feeling in ('Calmer', 'About the same', 'More energized', 'Still overwhelmed')),
  created_at timestamptz not null default now()
);

-- =========================================================================
-- RECOMMENDATIONS + AI
-- =========================================================================

create table recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('meal', 'activity', 'calm')),
  provider text not null default 'mock',
  entity_id uuid,
  reason text,
  score numeric,
  distance_miles numeric,
  price numeric,
  duration_minutes integer,
  nutrition_confidence text,
  location_context jsonb,
  accepted boolean,
  dismissed boolean not null default false,
  generated_at timestamptz not null default now()
);

create table recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references recommendations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  feedback text,
  created_at timestamptz not null default now()
);

create table ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  evidence_summary text,
  confidence text check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now(),
  dismissed_at timestamptz
);

create table weekly_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  summary jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

-- =========================================================================
-- SUBSCRIPTIONS + NOTIFICATIONS + LOCATION + CALENDAR
-- =========================================================================

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'monthly', 'annual')),
  status text not null default 'active' check (status in ('active', 'trialing', 'canceled', 'expired')),
  provider text not null default 'mock' check (provider in ('mock', 'revenuecat')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger subscriptions_set_updated_at before update on subscriptions
  for each row execute function set_updated_at();

create table notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  water boolean not null default true,
  meals boolean not null default true,
  movement boolean not null default true,
  sleep boolean not null default true,
  supplements boolean not null default false,
  calm boolean not null default true,
  nearby_recommendations boolean not null default true,
  weekly_review boolean not null default true,
  connected_device_status boolean not null default true,
  quiet_hours_start time,
  quiet_hours_end time
);

create table location_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  latitude numeric,
  longitude numeric,
  label text,
  captured_at timestamptz not null default now()
);

create table calendar_availability (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  label text,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================

alter table profiles enable row level security;
alter table dietary_preferences enable row level security;
alter table allergies enable row level security;
alter table workout_preferences enable row level security;
alter table health_connections enable row level security;
alter table daily_targets enable row level security;
alter table daily_summaries enable row level security;
alter table meals enable row level security;
alter table meal_items enable row level security;
alter table saved_meals enable row level security;
alter table favorite_restaurants enable row level security;
alter table water_entries enable row level security;
alter table supplements enable row level security;
alter table supplement_logs enable row level security;
alter table workouts enable row level security;
alter table mood_entries enable row level security;
alter table sleep_entries enable row level security;
alter table weight_entries enable row level security;
alter table body_measurements enable row level security;
alter table calm_session_logs enable row level security;
alter table recommendations enable row level security;
alter table recommendation_feedback enable row level security;
alter table ai_conversations enable row level security;
alter table ai_messages enable row level security;
alter table insights enable row level security;
alter table weekly_reports enable row level security;
alter table subscriptions enable row level security;
alter table notification_preferences enable row level security;
alter table location_snapshots enable row level security;
alter table calendar_availability enable row level security;

-- Public read-only reference/catalog tables (restaurants, menu items, venues,
-- classes, workout types, calm sessions) stay world-readable; they carry no
-- private user data. RLS is not enabled on those tables.

create policy "profiles_owner" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "dietary_preferences_owner" on dietary_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "allergies_owner" on allergies for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout_preferences_owner" on workout_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "health_connections_owner" on health_connections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_targets_owner" on daily_targets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "daily_summaries_owner" on daily_summaries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_owner" on meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meal_items_owner" on meal_items for all using (
  auth.uid() = (select user_id from meals where meals.id = meal_items.meal_id)
) with check (
  auth.uid() = (select user_id from meals where meals.id = meal_items.meal_id)
);
create policy "saved_meals_owner" on saved_meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "favorite_restaurants_owner" on favorite_restaurants for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "water_entries_owner" on water_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "supplements_owner" on supplements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "supplement_logs_owner" on supplement_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_owner" on workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mood_entries_owner" on mood_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sleep_entries_owner" on sleep_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weight_entries_owner" on weight_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "body_measurements_owner" on body_measurements for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "calm_session_logs_owner" on calm_session_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recommendations_owner" on recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recommendation_feedback_owner" on recommendation_feedback for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_conversations_owner" on ai_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ai_messages_owner" on ai_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "insights_owner" on insights for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "weekly_reports_owner" on weekly_reports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subscriptions_owner" on subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notification_preferences_owner" on notification_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "location_snapshots_owner" on location_snapshots for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "calendar_availability_owner" on calendar_availability for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile + default rows on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.subscriptions (user_id, plan, status) values (new.id, 'free', 'active');
  insert into public.notification_preferences (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
