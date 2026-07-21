import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinMoodSelector, KinPill, KinText, type Mood } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useAddMood } from '@/queries/useToday';

const PRESENT_TAGS = ['Work', 'School', 'Relationships', 'Body', 'Sleep', 'Food', 'Travel', 'Health', 'Something else'];

const RECOMMENDATIONS: Record<string, string> = {
  Stressed: 'Try a one-minute extended-exhale reset.',
  Overwhelmed: 'A one-minute reset might help before anything else.',
  Tired: 'A short walk or quiet recovery may fit better than an intense workout.',
  Restless: 'A nearby movement option could help release some energy.',
};

export default function MoodCheckInScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const addMood = useAddMood(session?.user.id);
  const [mood, setMood] = useState<Mood>();
  const [tag, setTag] = useState<string>();
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!mood) return;
    await addMood.mutateAsync({ mood, contextTags: tag ? [tag] : [], note: note || undefined });
    setSaved(true);
  };

  if (saved && mood) {
    const rec = RECOMMENDATIONS[mood];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.celadon, padding: 24, justifyContent: 'center' }}>
        <KinText variant="h2" color={colors.moss}>
          Thanks for checking in.
        </KinText>
        {rec ? (
          <KinText variant="body" color={colors.forest} style={{ marginTop: 12 }}>
            {rec}
          </KinText>
        ) : null}
        <View style={{ marginTop: 24 }}>
          <KinButton label="Done" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Check in" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <KinText variant="h2" color={colors.ink} style={{ marginBottom: 16 }}>
          How are you feeling right now?
        </KinText>
        <KinMoodSelector value={mood} onChange={setMood} />

        <KinText variant="h3" color={colors.ink} style={{ marginTop: 24, marginBottom: 12 }}>
          What feels most present?
        </KinText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {PRESENT_TAGS.map((t) => (
            <KinPill key={t} label={t} selected={tag === t} onPress={() => setTag(t)} />
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <KinInput placeholder="Add a note (optional)" value={note} onChangeText={setNote} multiline />
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <KinButton label="Check in" onPress={handleSave} disabled={!mood} loading={addMood.isPending} />
      </View>
    </SafeAreaView>
  );
}
