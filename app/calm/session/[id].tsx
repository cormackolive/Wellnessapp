import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { X, Pause, Play } from 'lucide-react-native';
import { colors, gradients } from '@/theme';
import { KinBreathingOrb, KinText, useReducedMotion } from '@/components';
import { getCalmSession } from '@/data/calmSessions';

export default function CalmSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const session = getCalmSession(id);
  const reducedMotion = useReducedMotion();

  const [secondsLeft, setSecondsLeft] = useState(session?.durationSeconds ?? 60);
  const [paused, setPaused] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.replace(`/calm/complete?slug=${id}`);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, id, router]);

  useEffect(() => {
    if (!session || paused) return;
    const phase = session.phases[phaseIndex % session.phases.length];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    phaseTimerRef.current = setTimeout(() => setPhaseIndex((i) => i + 1), phase.durationMs);
    return () => clearTimeout(phaseTimerRef.current);
  }, [phaseIndex, paused, session]);

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, padding: 24 }}>
        <KinText variant="body" color={colors.ink}>
          Session not found.
        </KinText>
      </SafeAreaView>
    );
  }

  const currentPhase = session.phases[phaseIndex % session.phases.length];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={gradients.primary} style={{ position: 'absolute', inset: 0 }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 8 }}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <X color={colors.ink} size={24} strokeWidth={1.75} />
          </Pressable>
          <KinText variant="caption" color={colors.forest}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </KinText>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {session.instructionLines.map((line, i) => (
            <KinText key={i} variant="displayItalic" color={colors.moss} style={{ textAlign: 'center' }}>
              {line}
            </KinText>
          ))}

          <View style={{ marginTop: 40 }}>
            <KinBreathingOrb phases={session.phases} reducedMotion={reducedMotion} />
          </View>

          <KinText variant="h3" color={colors.forest} style={{ marginTop: 32 }}>
            {currentPhase.label}
          </KinText>
        </View>

        <View style={{ alignItems: 'center', paddingBottom: 32 }}>
          <Pressable
            onPress={() => setPaused((p) => !p)}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {paused ? (
              <Play color={colors.moss} size={22} strokeWidth={1.75} />
            ) : (
              <Pause color={colors.moss} size={22} strokeWidth={1.75} />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
