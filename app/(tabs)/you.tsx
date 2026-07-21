import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Sliders, Link2, Bell, CreditCard, Shield, HelpCircle } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinCard, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';
import { useEntitlement } from '@/queries/useSubscription';

type Row = { icon: LucideIcon; label: string; href?: string; onPress?: () => void };

export default function YouScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);
  const { data: profile } = useProfile(session?.user.id);
  const { data: entitlement } = useEntitlement(session?.user.id);

  const rows: Row[] = [
    { icon: Sliders, label: 'Tracking preferences', href: '/profile/tracking-preferences' },
    { icon: Link2, label: 'Connected apps', href: '/(onboarding)/connected-apps' },
    { icon: Bell, label: 'Notifications', href: '/profile/notifications' },
    { icon: CreditCard, label: 'Subscription', href: '/profile/subscription' },
    { icon: Shield, label: 'Privacy and data', href: '/profile/privacy' },
    { icon: HelpCircle, label: 'Help and support', href: '/profile/help' },
  ];

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ marginBottom: 20 }}>
          <KinText variant="h1" color={colors.ink}>
            {profile?.first_name ?? 'You'}
          </KinText>
          <KinText variant="body" color={colors.forest} style={{ marginTop: 4 }}>
            {entitlement?.isPremium ? `Kin ${entitlement.plan}` : 'Kin Free'}
          </KinText>
        </View>

        <KinCard padded={false} style={{ overflow: 'hidden' }}>
          {rows.map((row, i) => (
            <Pressable
              key={row.label}
              onPress={() => (row.href ? router.push(row.href as any) : row.onPress?.())}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: i === rows.length - 1 ? 0 : 1,
                borderBottomColor: colors.stone,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <row.icon size={18} color={colors.moss} strokeWidth={1.75} />
              <KinText variant="body" color={colors.ink} style={{ flex: 1, marginLeft: 12 }}>
                {row.label}
              </KinText>
              <ChevronRight size={18} color={colors.sage} strokeWidth={1.75} />
            </Pressable>
          ))}
        </KinCard>

        <Pressable onPress={handleSignOut} style={{ marginTop: 24, alignItems: 'center' }}>
          <KinText variant="body" color={colors.error}>
            Sign out
          </KinText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
