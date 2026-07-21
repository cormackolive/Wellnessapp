import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  visible: boolean;
  message: string;
  onHide: () => void;
  durationMs?: number;
};

export function KinToast({ visible, message, onHide, durationMs = 2400 }: Props) {
  const translateY = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
    const timer = setTimeout(() => {
      Animated.timing(translateY, { toValue: 80, duration: 220, useNativeDriver: true }).start(onHide);
    }, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, onHide, translateY]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 32,
        left: 20,
        right: 20,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          backgroundColor: colors.ink,
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 18,
        }}
      >
        <KinText variant="body" color={colors.white}>
          {message}
        </KinText>
      </View>
    </Animated.View>
  );
}
