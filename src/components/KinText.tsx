import { Text, type TextProps } from 'react-native';
import { colors, type } from '@/theme';

export type KinTextVariant = keyof typeof type;

type Props = TextProps & {
  variant?: KinTextVariant;
  color?: string;
  className?: string;
};

export function KinText({ variant = 'body', color = colors.ink, style, className, ...rest }: Props) {
  return (
    <Text
      className={className}
      style={[type[variant], { color }, style]}
      {...rest}
    />
  );
}
