import { View } from 'react-native';
import { colors } from '@/theme';

type Props = {
  current: number;
  total: number;
};

export function KinOnboardingProgress({ current, total }: Props) {
  const progress = total > 0 ? (current + 1) / total : 0;

  return (
    <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.oat, overflow: 'hidden' }}>
      <View
        style={{
          height: '100%',
          width: `${Math.round(progress * 100)}%`,
          backgroundColor: colors.moss,
          borderRadius: 2,
        }}
      />
    </View>
  );
}
