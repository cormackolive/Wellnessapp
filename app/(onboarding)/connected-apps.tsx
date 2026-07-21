import { Platform, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinPill, KinText } from '@/components';
import { useOnboardingStore } from '@/store/onboardingStore';

const PROVIDERS = Platform.select({
  ios: ['Apple Health', 'Oura', 'Whoop', 'Garmin', 'Fitbit', 'Strava', 'Calendar'],
  default: ['Health Connect', 'Oura', 'Whoop', 'Garmin', 'Fitbit', 'Strava', 'Calendar'],
})!;

export default function ConnectedAppsScreen() {
  const router = useRouter();
  const { answers, update } = useOnboardingStore();

  const toggle = (provider: string) => {
    const set = new Set(answers.connectedProviders);
    if (set.has(provider)) set.delete(provider);
    else set.add(provider);
    update({ connectedProviders: Array.from(set) });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <KinHeader showBack />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          CONNECTED DATA
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8 }}>
          Want to connect anything?
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginTop: 8, marginBottom: 20 }}>
          Kin can read activity, sleep, and recovery data to personalize recommendations. Nothing is imported
          without your approval, and you can disconnect anytime.
        </KinText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {PROVIDERS.map((provider) => (
            <KinPill
              key={provider}
              label={provider}
              selected={answers.connectedProviders.includes(provider)}
              onPress={() => toggle(provider)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <KinButton label="Continue" onPress={() => router.push('/(onboarding)/permissions')} />
        <View style={{ marginTop: 8 }}>
          <KinButton label="Skip for now" variant="tertiary" onPress={() => router.push('/(onboarding)/permissions')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
