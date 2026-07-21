import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function KinInput({ label, error, style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      {label ? (
        <KinText variant="caption" color={colors.forest} style={{ marginBottom: 6 }}>
          {label}
        </KinText>
      ) : null}
      <TextInput
        placeholderTextColor={colors.sage}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          {
            height: 54,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: error ? colors.error : focused ? colors.moss : colors.stone,
            backgroundColor: colors.white,
            paddingHorizontal: 16,
            fontFamily: 'Manrope_400Regular',
            fontSize: 15,
            color: colors.ink,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <KinText variant="small" color={colors.error} style={{ marginTop: 4 }}>
          {error}
        </KinText>
      ) : null}
    </View>
  );
}
