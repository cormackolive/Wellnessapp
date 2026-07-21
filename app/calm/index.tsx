import { Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinCard, KinHeader, KinText } from '@/components';
import { CALM_SESSIONS } from '@/data/calmSessions';

export default function CalmLibraryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack eyebrow="RESET AND CALM" title="Calm" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        {CALM_SESSIONS.map((session) => (
          <Pressable key={session.slug} onPress={() => router.push(`/calm/session/${session.slug}`)}>
            <KinCard style={{ marginBottom: 12 }}>
              <KinText variant="h3" color={colors.ink}>
                {session.title}
              </KinText>
              <KinText variant="small" color={colors.forest} style={{ marginTop: 4 }}>
                {session.description}
              </KinText>
              <KinText variant="caption" color={colors.sage} style={{ marginTop: 8 }}>
                {Math.round(session.durationSeconds / 60) || 1} min
              </KinText>
            </KinCard>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
