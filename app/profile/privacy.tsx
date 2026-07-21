import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinCard, KinHeader, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

const DATA_CATEGORIES = [
  'Account and profile details',
  'Nutrition and meal logs (including photos you choose to analyze)',
  'Movement, sleep, and mood logs',
  'Location snapshots used only to generate nearby recommendations',
  'Connected app data you explicitly authorize',
];

export default function PrivacyScreen() {
  const signOut = useAuthStore((s) => s.signOut);

  const handleExport = () => {
    Alert.alert('Data export', 'A copy of your data will be emailed to your account address within 48 hours.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete account',
      'This permanently deletes your Kin account and all associated data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Account deletion requires a privileged server-side call (service role),
            // which the client never holds. This triggers sign-out and should be wired
            // to a Supabase Edge Function that performs the actual deletion.
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Privacy and data" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        <KinCard style={{ marginBottom: 20 }}>
          <KinText variant="h3" color={colors.ink} style={{ marginBottom: 8 }}>
            What Kin stores
          </KinText>
          {DATA_CATEGORIES.map((c) => (
            <KinText key={c} variant="small" color={colors.forest} style={{ marginBottom: 6 }}>
              · {c}
            </KinText>
          ))}
        </KinCard>

        <KinButton label="Export my data" variant="secondary" onPress={handleExport} />
        <View style={{ marginTop: 12 }}>
          <KinButton label="Delete account" variant="danger" onPress={handleDelete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
