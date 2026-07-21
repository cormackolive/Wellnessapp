import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme';
import { KinCard, KinChart, KinEmptyState, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';
import { supabase } from '@/lib/supabase';
import { LineChart } from 'lucide-react-native';

type Range = 'Week' | 'Month' | '3 Months';
const RANGE_DAYS: Record<Range, number> = { Week: 7, Month: 30, '3 Months': 90 };

export default function ProgressScreen() {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user.id;
  const { data: profile } = useProfile(userId);
  const [range, setRange] = useState<Range>('Week');

  const since = new Date();
  since.setDate(since.getDate() - RANGE_DAYS[range]);

  const { data: weightEntries = [] } = useQuery({
    queryKey: ['progress-weight', userId, range],
    enabled: Boolean(userId) && profile?.show_weight !== false,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId!)
        .gte('logged_at', since.toISOString())
        .order('logged_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: moodEntries = [] } = useQuery({
    queryKey: ['progress-mood', userId, range],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId!)
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: workouts = [] } = useQuery({
    queryKey: ['progress-workouts', userId, range],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId!)
        .gte('started_at', since.toISOString());
      if (error) throw error;
      return data ?? [];
    },
  });

  const weightChartData = weightEntries.map((w) => ({ x: w.logged_at, y: w.weight_kg }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <KinText variant="h1" color={colors.ink} style={{ marginBottom: 16 }}>
          Progress
        </KinText>

        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          {(Object.keys(RANGE_DAYS) as Range[]).map((r) => (
            <KinPill key={r} label={r} selected={range === r} onPress={() => setRange(r)} />
          ))}
        </View>

        <KinCard style={{ marginBottom: 16 }}>
          <KinText variant="h3" color={colors.ink} style={{ marginBottom: 4 }}>
            This {range.toLowerCase()}'s reflection
          </KinText>
          <KinText variant="body" color={colors.forest}>
            You moved {workouts.length} time{workouts.length === 1 ? '' : 's'} and checked in {moodEntries.length}{' '}
            time{moodEntries.length === 1 ? '' : 's'}. Your strongest pattern is consistency, not intensity.
          </KinText>
        </KinCard>

        {profile?.show_weight !== false ? (
          <KinCard style={{ marginBottom: 16 }}>
            <KinText variant="h3" color={colors.ink} style={{ marginBottom: 12 }}>
              Weight
            </KinText>
            {weightChartData.length > 1 ? (
              <KinChart data={weightChartData} formatValue={(v) => `${v.toFixed(1)} kg`} />
            ) : (
              <KinEmptyState icon={LineChart} title="Not enough entries yet" body="Log your weight a couple more times to see a trend." />
            )}
          </KinCard>
        ) : null}

        <KinCard>
          <KinText variant="h3" color={colors.ink} style={{ marginBottom: 8 }}>
            Movement consistency
          </KinText>
          <KinText variant="body" color={colors.forest}>
            {workouts.length} session{workouts.length === 1 ? '' : 's'} logged this {range.toLowerCase()}.
          </KinText>
        </KinCard>
      </ScrollView>
    </SafeAreaView>
  );
}
