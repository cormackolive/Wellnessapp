import { View, type ViewProps } from 'react-native';
import { colors } from '@/theme';

type Props = ViewProps & {
  elevated?: boolean;
  padded?: boolean;
};

export function KinCard({ elevated = false, padded = true, style, children, ...rest }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          borderRadius: 20,
          padding: padded ? 20 : 0,
          borderWidth: 1,
          borderColor: 'rgba(32, 34, 30, 0.08)',
          shadowColor: colors.ink,
          shadowOffset: { width: 0, height: elevated ? 16 : 8 },
          shadowOpacity: elevated ? 0.11 : 0.07,
          shadowRadius: elevated ? 50 : 30,
          elevation: elevated ? 8 : 4,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
