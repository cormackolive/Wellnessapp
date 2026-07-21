import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { DailyTarget, Meal, MoodEntry, SleepEntry, WaterEntry, Workout } from '@/types/database';

function todayRangeISO() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function useDailyTargets(userId: string | undefined) {
  return useQuery({
    queryKey: ['daily-targets', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<DailyTarget | null> => {
      const { data, error } = await supabase
        .from('daily_targets')
        .select('*')
        .eq('user_id', userId!)
        .order('effective_date', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useTodayMeals(userId: string | undefined) {
  const { start, end } = todayRangeISO();
  return useQuery({
    queryKey: ['today-meals', userId, start],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Meal[]> => {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', userId!)
        .gte('eaten_at', start)
        .lte('eaten_at', end)
        .order('eaten_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTodayWater(userId: string | undefined) {
  const { start, end } = todayRangeISO();
  return useQuery({
    queryKey: ['today-water', userId, start],
    enabled: Boolean(userId),
    queryFn: async (): Promise<WaterEntry[]> => {
      const { data, error } = await supabase
        .from('water_entries')
        .select('*')
        .eq('user_id', userId!)
        .gte('logged_at', start)
        .lte('logged_at', end);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useTodayWorkouts(userId: string | undefined) {
  const { start, end } = todayRangeISO();
  return useQuery({
    queryKey: ['today-workouts', userId, start],
    enabled: Boolean(userId),
    queryFn: async (): Promise<Workout[]> => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId!)
        .gte('started_at', start)
        .lte('started_at', end);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLatestMood(userId: string | undefined) {
  return useQuery({
    queryKey: ['latest-mood', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<MoodEntry | null> => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useLatestSleep(userId: string | undefined) {
  return useQuery({
    queryKey: ['latest-sleep', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<SleepEntry | null> => {
      const { data, error } = await supabase
        .from('sleep_entries')
        .select('*')
        .eq('user_id', userId!)
        .order('sleep_end', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

function useInvalidateToday(userId: string | undefined) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['today-meals', userId] });
    queryClient.invalidateQueries({ queryKey: ['today-water', userId] });
    queryClient.invalidateQueries({ queryKey: ['today-workouts', userId] });
    queryClient.invalidateQueries({ queryKey: ['latest-mood', userId] });
    queryClient.invalidateQueries({ queryKey: ['latest-sleep', userId] });
  };
}

export function useAddWater(userId: string | undefined) {
  const invalidate = useInvalidateToday(userId);
  return useMutation({
    mutationFn: async (amountMl: number) => {
      if (!userId) throw new Error('Missing user id');
      const { error } = await supabase.from('water_entries').insert({ user_id: userId, amount_ml: amountMl });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useAddWorkout(userId: string | undefined) {
  const invalidate = useInvalidateToday(userId);
  return useMutation({
    mutationFn: async (input: { workoutTypeId?: string; durationMinutes: number; notes?: string }) => {
      if (!userId) throw new Error('Missing user id');
      const { error } = await supabase.from('workouts').insert({
        user_id: userId,
        workout_type_id: input.workoutTypeId ?? null,
        duration_minutes: input.durationMinutes,
        notes: input.notes ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useAddMood(userId: string | undefined) {
  const invalidate = useInvalidateToday(userId);
  return useMutation({
    mutationFn: async (input: { mood: string; stressLevel?: number; contextTags?: string[]; note?: string }) => {
      if (!userId) throw new Error('Missing user id');
      const { error } = await supabase.from('mood_entries').insert({
        user_id: userId,
        mood: input.mood,
        stress_level: input.stressLevel ?? null,
        context_tags: input.contextTags ?? [],
        note: input.note ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useAddWeight(userId: string | undefined) {
  return useMutation({
    mutationFn: async (input: { weightKg: number; note?: string }) => {
      if (!userId) throw new Error('Missing user id');
      const { error } = await supabase
        .from('weight_entries')
        .insert({ user_id: userId, weight_kg: input.weightKg, note: input.note ?? null });
      if (error) throw error;
    },
  });
}

export function useAddSleep(userId: string | undefined) {
  const invalidate = useInvalidateToday(userId);
  return useMutation({
    mutationFn: async (input: { sleepStart: string; sleepEnd: string; restfulness?: number }) => {
      if (!userId) throw new Error('Missing user id');
      const durationMinutes = Math.round(
        (new Date(input.sleepEnd).getTime() - new Date(input.sleepStart).getTime()) / 60000
      );
      const { error } = await supabase.from('sleep_entries').insert({
        user_id: userId,
        sleep_start: input.sleepStart,
        sleep_end: input.sleepEnd,
        duration_minutes: durationMinutes,
        restfulness: input.restfulness ?? null,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
}

export function useAddMeal(userId: string | undefined) {
  const invalidate = useInvalidateToday(userId);
  return useMutation({
    mutationFn: async (input: {
      mealType?: Meal['meal_type'];
      source: Meal['source'];
      calorieMin?: number;
      calorieMax?: number;
      proteinG?: number;
      carbsG?: number;
      fatG?: number;
      fiberG?: number;
      confidence?: Meal['confidence'];
      notes?: string;
      items: { name: string; quantity?: string }[];
    }) => {
      if (!userId) throw new Error('Missing user id');
      const { data: meal, error } = await supabase
        .from('meals')
        .insert({
          user_id: userId,
          meal_type: input.mealType ?? null,
          source: input.source,
          calorie_min: input.calorieMin ?? null,
          calorie_max: input.calorieMax ?? null,
          protein_g: input.proteinG ?? null,
          carbs_g: input.carbsG ?? null,
          fat_g: input.fatG ?? null,
          fiber_g: input.fiberG ?? null,
          confidence: input.confidence ?? null,
          notes: input.notes ?? null,
        })
        .select()
        .single();
      if (error) throw error;

      if (input.items.length > 0) {
        await supabase.from('meal_items').insert(
          input.items.map((item) => ({ meal_id: meal.id, name: item.name, quantity: item.quantity ?? null }))
        );
      }

      return meal;
    },
    onSuccess: invalidate,
  });
}
