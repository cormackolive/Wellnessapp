import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinText } from '@/components';
import { ONBOARDING_STEPS } from '@/data/onboardingSteps';

export default function OnboardingIntro() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <KinText variant="eyebrow" color={colors.sage}>
          BEFORE WE BEGIN
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8 }}>
          A few questions, at your pace.
        </KinText>
        <KinText variant="bodyLarge" color={colors.forest} style={{ marginTop: 12 }}>
          Kin uses this to build a plan that fits your actual life — not an ideal one. Answer what feels
          relevant; you can skip anything and change it later.
        </KinText>
      </View>
      <View style={{ marginBottom: 24 }}>
        <KinButton label="Let's begin" onPress={() => router.push(`/(onboarding)/${ONBOARDING_STEPS[0].id}`)} />
      </View>
    </SafeAreaView>
  );
}
