import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme';
import { KinActivityCard, KinEmptyState, KinLoadingState, KinPill, KinRestaurantCard, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';
import { useDailyTargets } from '@/queries/useToday';
import { placesProvider } from '@/lib/places';
import { Compass } from 'lucide-react-native';

const SUGGESTIONS = ['A quick meal', 'More protein', 'Something comforting', 'Under 600 calories', 'A gentle workout', 'Near me'];
type DiscoverTab = 'Eat' | 'Move' | 'Reset';

export default function DiscoverScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { data: profile } = useProfile(session?.user.id);
  const { data: targets } = useDailyTargets(session?.user.id);
  const [tab, setTab] = useState<DiscoverTab>('Eat');

  const { data: meals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ['discover-meals', session?.user.id],
    enabled: Boolean(session?.user.id) && tab === 'Eat',
    queryFn: () =>
      placesProvider.searchNearbyMeals({
        remainingCalorieMin: targets?.energy_kcal_min ?? undefined,
        remainingCalorieMax: targets?.energy_kcal_max ?? undefined,
        remainingProteinG: targets?.protein_g_max ?? undefined,
        allergies: [],
      }),
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['discover-activities', session?.user.id],
    enabled: Boolean(session?.user.id) && tab === 'Move',
    queryFn: () => placesProvider.searchNearbyActivities({}),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <KinText variant="h1" color={colors.ink}>
          Discover
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginTop: 4, marginBottom: 16 }}>
          What can you eat or do nearby that fits today?
        </KinText>

        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {(['Eat', 'Move', 'Reset'] as DiscoverTab[]).map((t) => (
            <KinPill key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
          ))}
        </View>

        {tab !== 'Reset' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {SUGGESTIONS.map((s) => (
              <KinPill key={s} label={s} onPress={() => {}} />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4 }}>
        {tab === 'Eat' ? (
          mealsLoading ? (
            <KinLoadingState label="Finding options that fit your day…" />
          ) : meals.length === 0 ? (
            <KinEmptyState
              icon={Compass}
              title="Nothing nearby matched every filter"
              body="Try expanding your distance or relaxing one preference."
            />
          ) : (
            meals.map((meal) => (
              <KinRestaurantCard key={meal.id} meal={meal} onPress={() => router.push(`/discover/restaurant/${meal.id}`)} />
            ))
          )
        ) : null}

        {tab === 'Move' ? (
          activitiesLoading ? (
            <KinLoadingState label="Looking nearby…" />
          ) : activities.length === 0 ? (
            <KinEmptyState icon={Compass} title="No nearby sessions matched" body="Try a different time window." />
          ) : (
            activities.map((activity) => (
              <KinActivityCard key={activity.id} activity={activity} onPress={() => router.push(`/discover/activity/${activity.id}`)} />
            ))
          )
        ) : null}

        {tab === 'Reset' ? (
          <View style={{ marginTop: 8 }}>
            <KinText variant="body" color={colors.forest} style={{ marginBottom: 12 }}>
              A short break can matter more than another task.
            </KinText>
            <KinPill label="Open Calm library" onPress={() => router.push('/calm')} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
