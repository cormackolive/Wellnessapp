import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Camera, Compass as CompassIcon, Droplets, MessageCircle, Wind } from 'lucide-react-native';
import { colors } from '@/theme';
import {
  KinText,
  KinCard,
  KinMetricCard,
  KinInsightCard,
  KinProgressRing,
  KinIconButton,
} from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';
import { useDailyTargets, useTodayMeals, useTodayWater, useTodayWorkouts, useLatestMood, useLatestSleep, useAddWater } from '@/queries/useToday';
import { placesProvider } from '@/lib/places';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function TodayScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const userId = session?.user.id;

  const { data: profile } = useProfile(userId);
  const { data: targets } = useDailyTargets(userId);
  const { data: meals = [] } = useTodayMeals(userId);
  const { data: waterEntries = [] } = useTodayWater(userId);
  const { data: workouts = [] } = useTodayWorkouts(userId);
  const { data: latestMood } = useLatestMood(userId);
  const { data: latestSleep } = useLatestSleep(userId);
  const addWater = useAddWater(userId);

  const { data: mealRecs = [] } = useQuery({
    queryKey: ['today-meal-rec', userId],
    enabled: Boolean(userId),
    queryFn: () =>
      placesProvider.searchNearbyMeals({
        remainingCalorieMin: targets?.energy_kcal_min ?? undefined,
        remainingCalorieMax: targets?.energy_kcal_max ?? undefined,
        allergies: [],
      }),
  });

  const consumedCalories = meals.reduce((sum, m) => sum + ((m.calorie_min ?? 0) + (m.calorie_max ?? 0)) / 2, 0);
  const consumedProtein = meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0);
  const waterMl = waterEntries.reduce((sum, w) => sum + w.amount_ml, 0);
  const activeMinutes = workouts.reduce((sum, w) => sum + (w.duration_minutes ?? 0), 0);

  const scores = useMemo(() => {
    const nourish = targets?.energy_kcal_max ? Math.min(1, consumedCalories / targets.energy_kcal_max) : 0;
    const hydrate = targets?.water_ml ? Math.min(1, waterMl / targets.water_ml) : 0;
    const move = targets?.workout_frequency_per_week ? Math.min(1, workouts.length / 1) : 0;
    return { nourish, hydrate, move };
  }, [consumedCalories, targets, waterMl, workouts.length]);

  const hasEnoughData = meals.length > 0 || waterEntries.length > 0 || workouts.length > 0 || Boolean(latestMood);

  const insight = useMemo(() => {
    if (latestMood?.mood === 'Stressed' || latestMood?.mood === 'Overwhelmed') {
      return {
        title: 'A gentler moment might help.',
        body: 'You checked in feeling stressed. A one-minute reset could be a good place to start before anything else.',
      };
    }
    if (latestSleep && latestSleep.duration_minutes && latestSleep.duration_minutes < 360) {
      return {
        title: 'A gentler evening may fit today.',
        body: 'You slept less than usual. A lighter session or short walk could support recovery better than an intense workout.',
      };
    }
    if (targets?.protein_g_min && consumedProtein < targets.protein_g_min * 0.5) {
      return {
        title: 'You have room for more protein today.',
        body: `You're at about ${Math.round(consumedProtein)}g so far. A nearby option could help you close the gap.`,
      };
    }
    return {
      title: 'Start with one small check-in.',
      body: 'Log a meal, add some water, or take a mood check-in — Kin gets more useful the more it learns your rhythm.',
    };
  }, [latestMood, latestSleep, targets, consumedProtein]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <View>
            <KinText variant="h2" color={colors.ink}>
              {greeting()}{profile?.first_name ? `, ${profile.first_name}` : ''}
            </KinText>
            <KinText variant="small" color={colors.sage} style={{ marginTop: 2 }}>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </KinText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => router.push('/concierge')} style={{ marginRight: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.oat,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageCircle size={18} color={colors.moss} strokeWidth={1.75} />
              </View>
            </Pressable>
            <Pressable onPress={() => router.push('/(tabs)/you')}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.celadon,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <KinText variant="body" color={colors.moss}>
                  {(profile?.first_name ?? 'K')[0]?.toUpperCase()}
                </KinText>
              </View>
            </Pressable>
          </View>
        </View>

        {profile?.show_kin_score ? (
          <KinCard elevated style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <KinText variant="eyebrow" color={colors.sage}>
                  TODAY'S KIN SCORE
                </KinText>
                <KinText variant="small" color={colors.forest} style={{ marginTop: 4, maxWidth: 200 }}>
                  {hasEnoughData
                    ? 'A flexible snapshot of the areas you chose to support.'
                    : 'Kin is still learning your rhythm.'}
                </KinText>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <KinProgressRing progress={scores.nourish} size={40} strokeWidth={4} color={colors.butter} />
                <View style={{ width: 6 }} />
                <KinProgressRing progress={scores.hydrate} size={40} strokeWidth={4} color={colors.info} />
                <View style={{ width: 6 }} />
                <KinProgressRing progress={scores.move} size={40} strokeWidth={4} color={colors.moss} />
              </View>
            </View>
          </KinCard>
        ) : null}

        <View style={{ marginBottom: 16 }}>
          <KinInsightCard title={insight.title} body={insight.body} />
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ alignItems: 'center', marginRight: 20 }}>
            <KinIconButton icon={Camera} onPress={() => router.push('/meal/camera')} background={colors.oat} />
            <KinText variant="caption" color={colors.forest} style={{ marginTop: 6 }}>
              Photograph
            </KinText>
          </View>
          <View style={{ alignItems: 'center', marginRight: 20 }}>
            <KinIconButton icon={CompassIcon} onPress={() => router.push('/(tabs)/discover')} background={colors.oat} />
            <KinText variant="caption" color={colors.forest} style={{ marginTop: 6 }}>
              Find dinner
            </KinText>
          </View>
          <View style={{ alignItems: 'center', marginRight: 20 }}>
            <KinIconButton icon={Droplets} onPress={() => addWater.mutate(250)} background={colors.oat} />
            <KinText variant="caption" color={colors.forest} style={{ marginTop: 6 }}>
              Add water
            </KinText>
          </View>
          <View style={{ alignItems: 'center' }}>
            <KinIconButton icon={Wind} onPress={() => router.push('/calm/session/one-minute-reset')} background={colors.oat} />
            <KinText variant="caption" color={colors.forest} style={{ marginTop: 6 }}>
              Calm Minute
            </KinText>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          {profile?.show_calories !== false ? (
            <KinMetricCard
              label="NOURISH"
              value={`${Math.round(consumedCalories)} kcal`}
              target={targets ? `of ${targets.energy_kcal_min}–${targets.energy_kcal_max}` : undefined}
              progress={scores.nourish}
              accentColor={colors.butter}
            />
          ) : null}
          {profile?.track_water !== false ? (
            <KinMetricCard
              label="HYDRATE"
              value={`${Math.round(waterMl / 250)} glasses`}
              target={targets ? `of ${Math.round(targets.water_ml! / 250)}` : undefined}
              progress={scores.hydrate}
              accentColor={colors.info}
            />
          ) : null}
          {profile?.track_workouts !== false ? (
            <KinMetricCard
              label="MOVE"
              value={`${activeMinutes} min`}
              target={workouts.length > 0 ? `${workouts.length} session${workouts.length > 1 ? 's' : ''}` : 'No sessions yet'}
              accentColor={colors.moss}
            />
          ) : null}
          {profile?.track_sleep !== false && latestSleep ? (
            <KinMetricCard
              label="RESTORE"
              value={latestSleep.duration_minutes ? `${Math.floor(latestSleep.duration_minutes / 60)}h ${latestSleep.duration_minutes % 60}m` : '–'}
              accentColor={colors.mistBlue}
            />
          ) : null}
          {profile?.track_mood !== false && latestMood ? (
            <KinMetricCard label="CALM" value={latestMood.mood} accentColor={colors.blush} />
          ) : null}
        </View>

        {mealRecs[0] ? (
          <Pressable onPress={() => router.push('/(tabs)/discover')}>
            <KinCard>
              <KinText variant="eyebrow" color={colors.sage}>
                NEARBY FOR YOU
              </KinText>
              <KinText variant="h3" color={colors.ink} style={{ marginTop: 4 }}>
                {mealRecs[0].mealName}
              </KinText>
              <KinText variant="body" color={colors.forest} style={{ marginTop: 4 }}>
                {mealRecs[0].calorieMin}–{mealRecs[0].calorieMax} kcal · {mealRecs[0].protein}g protein ·{' '}
                {mealRecs[0].etaMinMinutes}–{mealRecs[0].etaMaxMinutes} min
              </KinText>
            </KinCard>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
