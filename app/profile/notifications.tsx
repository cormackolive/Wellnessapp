import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { colors } from '@/theme';
import { KinHeader, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import type { NotificationPreferences } from '@/types/database';

const CATEGORIES: { key: keyof NotificationPreferences; label: string }[] = [
  { key: 'water', label: 'Water' },
  { key: 'meals', label: 'Meals' },
  { key: 'movement', label: 'Movement' },
  { key: 'sleep', label: 'Sleep' },
  { key: 'supplements', label: 'Supplements' },
  { key: 'calm', label: 'Calm' },
  { key: 'nearby_recommendations', label: 'Nearby recommendations' },
  { key: 'weekly_review', label: 'Weekly review' },
  { key: 'connected_device_status', label: 'Connected device status' },
];

export default function NotificationSettingsScreen() {
  const session = useAuthStore((s) => s.session);
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  const { data: prefs } = useQuery({
    queryKey: ['notification-prefs', userId],
    enabled: Boolean(userId),
    queryFn: async (): Promise<NotificationPreferences> => {
      const { data, error } = await supabase.from('notification_preferences').select('*').eq('user_id', userId!).single();
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<NotificationPreferences>) => {
      const { error } = await supabase.from('notification_preferences').update(patch).eq('user_id', userId!);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notification-prefs', userId] }),
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Notifications" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        <KinText variant="body" color={colors.forest} style={{ marginBottom: 16 }}>
          Reminders you choose, never constant nudges.
        </KinText>
        {CATEGORIES.map((cat) => {
          const value = prefs ? Boolean(prefs[cat.key]) : true;
          return (
            <View key={cat.key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <KinText variant="body" color={colors.ink}>
                {cat.label}
              </KinText>
              <KinPill label={value ? 'On' : 'Off'} selected={value} onPress={() => update.mutate({ [cat.key]: !value })} />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
