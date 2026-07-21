-- Seed data for local development and demos.
-- Restaurants, activity venues/classes, and calm sessions are marked is_mock = true
-- where applicable; they are realistic examples, not live listings.

insert into calm_sessions (slug, title, category, duration_seconds, description) values
  ('one-minute-reset', 'One-Minute Reset', 'quick', 60, 'A brief pause to settle your breath.'),
  ('three-minute-breathing', 'Three-Minute Breathing', 'breathing', 180, 'Gentle paced breathing to slow down.'),
  ('five-minute-breathing', 'Five-Minute Breathing', 'breathing', 300, 'Extended paced breathing for a deeper reset.'),
  ('box-breathing', 'Box Breathing', 'breathing', 240, 'Equal-count inhale, hold, exhale, hold.'),
  ('extended-exhale', 'Extended-Exhale Breathing', 'breathing', 180, 'Longer exhales to support the body''s calming response.'),
  ('grounding-exercise', 'Grounding Exercise', 'grounding', 240, 'Reconnect with your senses and the present moment.'),
  ('body-scan', 'Body Scan', 'mindfulness', 420, 'A slow scan of physical sensation from head to toe.'),
  ('walking-meditation', 'Walking Meditation', 'mindfulness', 300, 'Mindful movement at an easy pace.'),
  ('post-workout-reset', 'Post-Workout Reset', 'recovery', 180, 'Settle your nervous system after exertion.'),
  ('pre-sleep-winddown', 'Pre-Sleep Wind-Down', 'sleep', 360, 'Ease the transition into rest.'),
  ('focus-reset', 'Focus Reset', 'focus', 120, 'A short reset to return attention to the task at hand.'),
  ('gentle-stretch', 'Gentle Stretch', 'movement', 300, 'Light mobility to release tension.'),
  ('overwhelm-reset', 'Overwhelm Reset', 'grounding', 180, 'Support for moments that feel like too much.');

insert into workout_types (name, category) values
  ('Walking', 'cardio'), ('Running', 'cardio'), ('Strength training', 'strength'),
  ('Pilates', 'mind_body'), ('Yoga', 'mind_body'), ('Spin', 'cardio'), ('Dance', 'cardio'),
  ('HIIT', 'cardio'), ('Swimming', 'cardio'), ('Hiking', 'cardio'), ('Team sports', 'cardio'),
  ('Barre', 'mind_body'), ('Boxing', 'cardio'), ('Cycling', 'cardio'), ('At-home workout', 'strength'),
  ('Gym workout', 'strength'), ('Outdoor workout', 'cardio');

-- Restaurants + menu items (realistic seeded examples, not current live listings)
with r1 as (
  insert into restaurants (name, cuisine, address, latitude, longitude, price_level, rating, is_mock)
  values ('Meadow Kitchen', 'Mediterranean', '214 Elm Street', 37.7767, -122.4189, 2, 4.6, true)
  returning id
), r2 as (
  insert into restaurants (name, cuisine, address, latitude, longitude, price_level, rating, is_mock)
  values ('Sage & Rice', 'Asian Fusion', '88 Birchwood Ave', 37.7791, -122.4213, 2, 4.5, true)
  returning id
), r3 as (
  insert into restaurants (name, cuisine, address, latitude, longitude, price_level, rating, is_mock)
  values ('Copper Pot', 'Comfort', '540 Laurel Way', 37.7748, -122.4166, 1, 4.4, true)
  returning id
)
insert into restaurant_menu_items (restaurant_id, name, description, price, calorie_min, calorie_max, protein_g, carbs_g, fat_g, fiber_g, dietary_labels, allergens, nutrition_source)
select id, 'Herbed Chicken Grain Bowl', 'Grilled chicken, farro, roasted vegetables, herb yogurt.', 17, 580, 670, 42, 65, 19, 9, array['high-protein'], array['dairy'], 'estimated' from r1
union all
select id, 'Chicken Shawarma Bowl', 'Spiced chicken, rice, pickled vegetables, tahini.', 17, 540, 640, 41, 58, 18, 7, array['high-protein'], array[]::text[], 'estimated' from r1
union all
select id, 'Miso Tofu Bowl', 'Marinated tofu, brown rice, greens, miso glaze.', 15, 510, 620, 28, 72, 16, 11, array['plant-forward', 'vegan'], array['soy'], 'estimated' from r2
union all
select id, 'Sesame Noodle Salad', 'Cold soba, cucumber, edamame, sesame dressing.', 14, 460, 560, 22, 68, 14, 8, array['plant-forward'], array['soy', 'sesame', 'gluten'], 'estimated' from r2
union all
select id, 'Turkey Chili Bowl', 'Lean turkey, beans, brown rice, avocado.', 13, 520, 610, 38, 55, 16, 12, array['high-protein'], array[]::text[], 'estimated' from r3;

with v1 as (
  insert into activity_venues (name, address, latitude, longitude, is_mock)
  values ('Still Studio', '120 Willow Court', 37.7774, -122.4201, true)
  returning id
), v2 as (
  insert into activity_venues (name, address, latitude, longitude, is_mock)
  values ('Northside Run Club', 'Riverside Path', 37.7803, -122.4179, true)
  returning id
)
insert into activity_classes (venue_id, name, category, difficulty, duration_minutes, price, starts_at, energy_kcal_min, energy_kcal_max, rating)
select id, 'Evening Restore Yoga', 'yoga', 'Beginner', 45, 24, now() + interval '3 hours', 90, 140, 4.8 from v1
union all
select id, 'Midday Reformer Pilates', 'pilates', 'Intermediate', 50, 32, now() + interval '5 hours', 160, 220, 4.7 from v1
union all
select id, 'Sunset Recovery Run', 'running', 'Beginner', 30, 0, now() + interval '4 hours', 220, 300, 4.5 from v2;
