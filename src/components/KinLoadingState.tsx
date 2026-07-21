import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  label?: string;
};

export function KinLoadingState({ label = 'Bringing your day together…' }: Props) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
      <Animated.View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.celadon,
          opacity,
          marginBottom: 16,
        }}
      />
      <KinText variant="body" color={colors.forest}>
        {label}
      </KinText>
    </View>
  );
}
