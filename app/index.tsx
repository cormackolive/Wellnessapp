import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';
import { colors } from '@/theme';
import { KinLoadingState } from '@/components';

export default function Index() {
  const session = useAuthStore((s) => s.session);
  const { data: profile, isLoading } = useProfile(session?.user.id);

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ivory, justifyContent: 'center' }}>
        <KinLoadingState label="Learning your rhythm…" />
      </View>
    );
  }

  if (!profile?.onboarding_completed) {
    return <Redirect href="/(onboarding)/intro" />;
  }

  return <Redirect href="/(tabs)/today" />;
}
