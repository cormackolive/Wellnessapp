import { Pressable } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

export function KinPill({ label, selected = false, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: selected ? colors.moss : colors.oat,
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        marginRight: 8,
        marginBottom: 8,
      })}
    >
      <KinText variant="body" color={selected ? colors.white : colors.ink}>
        {label}
      </KinText>
    </Pressable>
  );
}
