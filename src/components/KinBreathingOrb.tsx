import { useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '@/theme';

export type BreathingPhase = { label: string; durationMs: number; scale: number };

type Props = {
  phases: BreathingPhase[];
  size?: number;
  reducedMotion?: boolean;
};

export function KinBreathingOrb({ phases, size = 220, reducedMotion = false }: Props) {
  const scale = useSharedValue(phases[0]?.scale ?? 0.7);

  useEffect(() => {
    if (reducedMotion || phases.length === 0) return;

    const sequence = phases.map((phase) =>
      withTiming(phase.scale, { duration: phase.durationMs, easing: Easing.inOut(Easing.ease) })
    );

    scale.value = withRepeat(withSequence(...sequence), -1, false);

    return () => cancelAnimation(scale);
  }, [phases, reducedMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.celadon,
            opacity: 0.5,
          },
          animatedStyle,
        ]}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: (size * 0.55) / 2,
          backgroundColor: colors.moss,
          opacity: 0.85,
        }}
      />
    </View>
  );
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => sub.remove();
  }, []);
  return reduced;
}
