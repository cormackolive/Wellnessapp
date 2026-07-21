import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinCard } from './KinCard';
import { KinText } from './KinText';
import { KinButton } from './KinButton';

type Props = {
  icon: LucideIcon;
  title: string;
  body: string;
  onAllow: () => void;
  onSkip?: () => void;
};

export function KinPermissionCard({ icon: Icon, title, body, onAllow, onSkip }: Props) {
  return (
    <KinCard elevated>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.celadon,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Icon color={colors.moss} size={22} strokeWidth={1.5} />
      </View>
      <KinText variant="h3" color={colors.ink}>
        {title}
      </KinText>
      <KinText variant="body" color={colors.forest} style={{ marginTop: 8 }}>
        {body}
      </KinText>
      <View style={{ marginTop: 20 }}>
        <KinButton label="Allow" onPress={onAllow} />
        {onSkip ? (
          <View style={{ marginTop: 8 }}>
            <KinButton label="Not now" variant="tertiary" onPress={onSkip} />
          </View>
        ) : null}
      </View>
    </KinCard>
  );
}
