import { Pressable, type PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme';

type Props = PressableProps & {
  icon: LucideIcon;
  size?: number;
  color?: string;
  background?: string;
};

export function KinIconButton({ icon: Icon, size = 40, color = colors.ink, background = colors.oat, style, ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}
    >
      <Icon color={color} size={size * 0.45} strokeWidth={1.75} />
    </Pressable>
  );
}
