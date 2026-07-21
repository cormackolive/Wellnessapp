import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinPaywallCard, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { usePurchase } from '@/queries/useSubscription';
import { PRICING, PREMIUM_FEATURES, FREE_FEATURES } from '@/data/pricing';
import type { SubscriptionPlan } from '@/lib/payments';

export default function PaywallScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { mutateAsync: purchase, isPending } = usePurchase(session?.user.id);
  const [selected, setSelected] = useState<Exclude<SubscriptionPlan, 'free'>>('annual');
  const [error, setError] = useState<string | null>(null);

  const goToApp = () => router.replace('/(tabs)/today');

  const handleSubscribe = async () => {
    setError(null);
    try {
      await purchase(selected);
      goToApp();
    } catch (err: any) {
      setError(err?.message ?? 'Could not start your subscription. Try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 24 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          KIN PREMIUM
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8, marginBottom: 8 }}>
          Get the full concierge.
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginBottom: 24 }}>
          Free covers the essentials. Premium unlocks personalized recommendations, unlimited AI meal analysis,
          and your full progress picture.
        </KinText>

        <KinPaywallCard
          title="Annual"
          price={PRICING.annual.amount}
          billingNote={PRICING.annual.billingNote}
          badge="Best value"
          features={PREMIUM_FEATURES.slice(0, 5)}
          selected={selected === 'annual'}
          onPress={() => setSelected('annual')}
        />
        <KinPaywallCard
          title="Monthly"
          price={PRICING.monthly.amount}
          billingNote={PRICING.monthly.billingNote}
          features={PREMIUM_FEATURES.slice(0, 5)}
          selected={selected === 'monthly'}
          onPress={() => setSelected('monthly')}
        />

        {error ? (
          <KinText variant="small" color={colors.error} style={{ marginTop: 8, marginBottom: 8 }}>
            {error}
          </KinText>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <KinButton
            label={selected === 'annual' ? 'Start annual plan' : 'Choose monthly'}
            onPress={handleSubscribe}
            loading={isPending}
          />
          <View style={{ marginTop: 8 }}>
            <KinButton label="Continue with free" variant="tertiary" onPress={goToApp} />
          </View>
        </View>

        <KinText variant="caption" color={colors.sage} style={{ textAlign: 'center', marginTop: 20 }}>
          Free includes: {FREE_FEATURES.slice(0, 3).join(' · ')}
        </KinText>
      </ScrollView>
    </SafeAreaView>
  );
}
