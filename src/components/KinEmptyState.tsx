import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';
import { KinButton } from './KinButton';

type Props = {
  icon?: LucideIcon;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function KinEmptyState({ icon: Icon, title, body, actionLabel, onAction }: Props) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 }}>
      {Icon ? (
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.oat,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Icon color={colors.forest} size={24} strokeWidth={1.5} />
        </View>
      ) : null}
      <KinText variant="h3" color={colors.ink} style={{ textAlign: 'center' }}>
        {title}
      </KinText>
      {body ? (
        <KinText variant="body" color={colors.forest} style={{ textAlign: 'center', marginTop: 8 }}>
          {body}
        </KinText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={{ marginTop: 20, width: '100%' }}>
          <KinButton label={actionLabel} variant="secondary" onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
