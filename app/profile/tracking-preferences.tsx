import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinHeader, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useProfile, useUpdateProfile } from '@/queries/useProfile';
import type { Profile } from '@/types/database';

const TOGGLES: { key: keyof Profile; label: string; description: string }[] = [
  { key: 'show_calories', label: 'Show calories', description: 'Display calorie numbers on your dashboard.' },
  { key: 'show_macros', label: 'Show macros', description: 'Display protein, carb, and fat numbers.' },
  { key: 'show_weight', label: 'Show weight', description: 'Display your logged weight.' },
  { key: 'show_weight_projection', label: 'Show weight projection', description: 'Show a projected trend line.' },
  { key: 'show_kin_score', label: 'Show Kin Score', description: 'Show the flexible daily snapshot score.' },
  { key: 'track_mood', label: 'Track mood', description: 'Enable mood check-ins.' },
  { key: 'track_water', label: 'Track water', description: 'Enable hydration logging.' },
  { key: 'track_sleep', label: 'Track sleep', description: 'Enable sleep logging.' },
  { key: 'track_workouts', label: 'Track workouts', description: 'Enable movement logging.' },
  { key: 'track_supplements', label: 'Track supplements', description: 'Enable supplement reminders.' },
];

export default function TrackingPreferencesScreen() {
  const session = useAuthStore((s) => s.session);
  const { data: profile } = useProfile(session?.user.id);
  const updateProfile = useUpdateProfile(session?.user.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Tracking preferences" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        <KinText variant="body" color={colors.forest} style={{ marginBottom: 16 }}>
          You're in control of what Kin shows and tracks. Nothing here is required.
        </KinText>
        {TOGGLES.map((toggle) => {
          const value = profile ? Boolean(profile[toggle.key]) : true;
          return (
            <View key={toggle.key} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <KinText variant="h3" color={colors.ink}>
                    {toggle.label}
                  </KinText>
                  <KinText variant="small" color={colors.forest} style={{ marginTop: 2 }}>
                    {toggle.description}
                  </KinText>
                </View>
                <KinPill
                  label={value ? 'On' : 'Off'}
                  selected={value}
                  onPress={() => updateProfile.mutate({ [toggle.key]: !value } as Partial<Profile>)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
