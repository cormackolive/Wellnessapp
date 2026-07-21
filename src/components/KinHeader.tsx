import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

type Props = {
  title?: string;
  eyebrow?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
};

export function KinHeader({ title, eyebrow, showBack = false, rightSlot }: Props) {
  const router = useRouter();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, marginBottom: 8 }}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
          style={{ marginRight: 12 }}
        >
          <ChevronLeft color={colors.ink} size={24} strokeWidth={1.75} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <KinText variant="eyebrow" color={colors.sage}>
            {eyebrow}
          </KinText>
        ) : null}
        {title ? (
          <KinText variant="h2" color={colors.ink}>
            {title}
          </KinText>
        ) : null}
      </View>
      {rightSlot}
    </View>
  );
}
