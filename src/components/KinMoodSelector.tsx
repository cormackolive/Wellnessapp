import { Pressable, View } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

export const MOOD_OPTIONS = [
  'Calm',
  'Good',
  'Energized',
  'Neutral',
  'Tired',
  'Stressed',
  'Overwhelmed',
  'Low',
  'Restless',
] as const;

export type Mood = (typeof MOOD_OPTIONS)[number];

type Props = {
  value?: Mood;
  onChange: (mood: Mood) => void;
};

export function KinMoodSelector({ value, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {MOOD_OPTIONS.map((mood) => {
        const selected = value === mood;
        return (
          <Pressable
            key={mood}
            onPress={() => onChange(mood)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={({ pressed }) => ({
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: 999,
              backgroundColor: selected ? colors.moss : colors.oat,
              opacity: pressed ? 0.85 : 1,
              marginRight: 8,
              marginBottom: 8,
            })}
          >
            <KinText variant="body" color={selected ? colors.white : colors.ink}>
              {mood}
            </KinText>
          </Pressable>
        );
      })}
    </View>
  );
}
