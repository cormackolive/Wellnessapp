import { Pressable, View } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinCard } from './KinCard';
import { KinText } from './KinText';

type Props = {
  eyebrow?: string;
  title: string;
  body: string;
  onDismiss?: () => void;
  onPress?: () => void;
};

export function KinInsightCard({ eyebrow = "Your next best step", title, body, onDismiss, onPress }: Props) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <KinCard elevated>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <KinText variant="eyebrow" color={colors.sage}>
            {eyebrow}
          </KinText>
          {onDismiss ? (
            <Pressable onPress={onDismiss} hitSlop={12} accessibilityLabel="Dismiss insight">
              <X size={16} color={colors.sage} strokeWidth={1.75} />
            </Pressable>
          ) : null}
        </View>
        <KinText variant="h2" color={colors.ink} style={{ marginTop: 8 }}>
          {title}
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginTop: 8 }}>
          {body}
        </KinText>
      </KinCard>
    </Pressable>
  );
}
