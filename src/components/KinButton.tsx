import { ActivityIndicator, Pressable, type PressableProps } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger';

type Props = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.moss, text: colors.white },
  secondary: { bg: colors.oat, text: colors.ink },
  tertiary: { bg: 'transparent', text: colors.moss },
  danger: { bg: colors.error, text: colors.white },
};

export function KinButton({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...rest
}: Props) {
  const v = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          height: variant === 'tertiary' ? 48 : 54,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          backgroundColor: v.bg,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
          borderWidth: variant === 'tertiary' ? 1 : 0,
          borderColor: colors.stone,
        },
        typeof style === 'function' ? undefined : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <KinText variant="button" color={v.text}>
          {label}
        </KinText>
      )}
    </Pressable>
  );
}
