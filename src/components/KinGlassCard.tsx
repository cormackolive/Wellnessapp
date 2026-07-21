import { View, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

type Props = ViewProps & {
  intensity?: number;
};

export function KinGlassCard({ intensity = 40, style, children, ...rest }: Props) {
  return (
    <View
      style={[{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.38)' }, style]}
      {...rest}
    >
      <BlurView intensity={intensity} tint="light" style={{ padding: 20 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>{children}</View>
      </BlurView>
    </View>
  );
}
