import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinCard, KinHeader, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useEntitlement } from '@/queries/useSubscription';

export default function SubscriptionScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { data: entitlement } = useEntitlement(session?.user.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <KinHeader showBack title="Subscription" />
      <KinCard style={{ marginTop: 16 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          CURRENT PLAN
        </KinText>
        <KinText variant="h2" color={colors.ink} style={{ marginTop: 8, textTransform: 'capitalize' }}>
          Kin {entitlement?.plan ?? 'Free'}
        </KinText>
        {entitlement?.currentPeriodEnd ? (
          <KinText variant="small" color={colors.forest} style={{ marginTop: 8 }}>
            Renews {new Date(entitlement.currentPeriodEnd).toLocaleDateString()}
          </KinText>
        ) : null}
      </KinCard>
      <View style={{ marginTop: 20 }}>
        <KinButton
          label={entitlement?.isPremium ? 'Manage plan' : 'Upgrade to Premium'}
          onPress={() => router.push('/paywall')}
        />
      </View>
    </SafeAreaView>
  );
}
