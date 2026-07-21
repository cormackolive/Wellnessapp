import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinHeader, KinInput, KinLoadingState, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';
import { useDailyTargets, useLatestMood } from '@/queries/useToday';
import { aiProvider, type ConciergeMessage } from '@/lib/ai';

const PROMPTS = ['What should I order?', 'I only have 20 minutes.', 'I need more protein.', 'I feel stressed.', 'I barely slept.'];

export default function ConciergeScreen() {
  const session = useAuthStore((s) => s.session);
  const { data: profile } = useProfile(session?.user.id);
  const { data: targets } = useDailyTargets(session?.user.id);
  const { data: latestMood } = useLatestMood(session?.user.id);

  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const nextHistory = [...messages, { role: 'user' as const, content: text.trim() }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);
    try {
      const reply = await aiProvider.sendConciergeMessage(nextHistory, {
        firstName: profile?.first_name ?? undefined,
        primaryGoal: profile?.primary_goal ?? undefined,
        remainingCalories:
          profile?.show_calories && targets?.energy_kcal_min && targets?.energy_kcal_max
            ? { min: targets.energy_kcal_min, max: targets.energy_kcal_max }
            : undefined,
        remainingProteinG: targets?.protein_g_max ?? undefined,
        mood: latestMood?.mood,
        showCalories: profile?.show_calories,
        showWeight: profile?.show_weight,
      });
      setMessages((m) => [...m, { role: 'assistant', content: reply.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingHorizontal: 24 }}>
          <KinHeader showBack eyebrow="KIN CONCIERGE" title="Ask Kin" />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 24, paddingTop: 0, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={{ paddingTop: 20 }}>
              <KinText variant="body" color={colors.forest} style={{ marginBottom: 16 }}>
                Ask about what to eat, how to move today, or how to manage stress — Kin uses what you've shared to
                keep it realistic.
              </KinText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {PROMPTS.map((p) => (
                  <KinPill key={p} label={p} onPress={() => send(p)} />
                ))}
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: item.role === 'user' ? colors.moss : colors.oat,
                borderRadius: 16,
                padding: 14,
                marginBottom: 10,
                maxWidth: '85%',
              }}
            >
              <KinText variant="body" color={item.role === 'user' ? colors.white : colors.ink}>
                {item.content}
              </KinText>
            </View>
          )}
        />

        {loading ? <KinLoadingState label="Thinking…" /> : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <KinInput placeholder="Ask Kin anything…" value={input} onChangeText={setInput} onSubmitEditing={() => send(input)} />
          </View>
          <Pressable onPress={() => send(input)} hitSlop={8}>
            <KinText variant="button" color={colors.moss}>
              Send
            </KinText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
