import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { getCalmSession } from '@/data/calmSessions';
import { useState } from 'react';

const FEELINGS = ['Calmer', 'About the same', 'More energized', 'Still overwhelmed'] as const;

export default function CalmCompleteScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const meta = getCalmSession(slug);
  const [feeling, setFeeling] = useState<(typeof FEELINGS)[number]>();

  const handleDone = async () => {
    if (session?.user.id && meta) {
      const { data: sessionRow } = await supabase.from('calm_sessions').select('id').eq('slug', meta.slug).maybeSingle();
      if (sessionRow) {
        await supabase.from('calm_session_logs').insert({
          user_id: session.user.id,
          calm_session_id: sessionRow.id,
          completed: true,
          post_feeling: feeling ?? null,
        });
      }
    }
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.celadon, padding: 24, justifyContent: 'center' }}>
      <KinText variant="h1" color={colors.moss} style={{ textAlign: 'center' }}>
        How do you feel now?
      </KinText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
        {FEELINGS.map((f) => (
          <KinPill key={f} label={f} selected={feeling === f} onPress={() => setFeeling(f)} />
        ))}
      </View>
      <View style={{ marginTop: 32 }}>
        <KinButton label="Done" onPress={handleDone} />
      </View>
    </SafeAreaView>
  );
}
