import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { completeOnboarding, generatePlanFromAnswers } from '@/lib/onboardingActions';

const WORDS = ['Nourishment', 'Movement', 'Rest', 'Hydration', 'Energy', 'Calm'];

export default function GeneratingScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { answers, setGeneratedPlan } = useOnboardingStore();
  const [wordIndex, setWordIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 900);
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    return () => clearInterval(interval);
  }, [opacity]);

  useEffect(() => {
    async function run() {
      if (!session?.user.id) return;
      try {
        const plan = generatePlanFromAnswers(answers);
        await completeOnboarding(session.user.id, answers, plan);
        setGeneratedPlan(plan);
        await new Promise((r) => setTimeout(r, 1400));
        router.replace('/(onboarding)/plan-preview');
      } catch (err: any) {
        setError(err?.message ?? 'Something went wrong building your plan.');
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.celadon, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <KinText variant="h1" color={colors.moss} style={{ textAlign: 'center' }}>
        Your Kin plan is taking shape.
      </KinText>
      <View style={{ height: 60, marginTop: 24, justifyContent: 'center' }}>
        <Animated.View style={{ opacity }}>
          <KinText variant="displayL" color={colors.forest} style={{ textAlign: 'center' }}>
            {WORDS[wordIndex]}
          </KinText>
        </Animated.View>
      </View>
      {error ? (
        <KinText variant="small" color={colors.error} style={{ marginTop: 24, textAlign: 'center' }}>
          {error}
        </KinText>
      ) : null}
    </SafeAreaView>
  );
}
