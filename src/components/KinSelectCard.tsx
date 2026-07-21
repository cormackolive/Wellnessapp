import { Pressable, View } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  title: string;
  subtitle?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function KinSelectCard({ title, subtitle, selected = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => ({
        borderRadius: 20,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.moss : colors.stone,
        backgroundColor: selected ? colors.celadon : colors.white,
        padding: 16,
        marginBottom: 12,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <KinText variant="h3" color={colors.ink}>
            {title}
          </KinText>
          {subtitle ? (
            <KinText variant="small" color={colors.forest} style={{ marginTop: 4 }}>
              {subtitle}
            </KinText>
          ) : null}
        </View>
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: selected ? colors.moss : colors.stone,
            backgroundColor: selected ? colors.moss : 'transparent',
          }}
        />
      </View>
    </Pressable>
  );
}
