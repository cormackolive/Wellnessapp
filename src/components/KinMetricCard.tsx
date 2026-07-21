import { View } from 'react-native';
import { colors } from '@/theme';
import { KinCard } from './KinCard';
import { KinText } from './KinText';
import { KinProgressRing } from './KinProgressRing';

type Props = {
  label: string;
  value: string;
  target?: string;
  progress?: number;
  accentColor?: string;
};

export function KinMetricCard({ label, value, target, progress, accentColor = colors.moss }: Props) {
  return (
    <KinCard style={{ flex: 1, minWidth: 150 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <KinText variant="eyebrow" color={colors.sage}>
            {label}
          </KinText>
          <KinText variant="h2" color={colors.ink} style={{ marginTop: 6 }}>
            {value}
          </KinText>
          {target ? (
            <KinText variant="small" color={colors.forest} style={{ marginTop: 2 }}>
              {target}
            </KinText>
          ) : null}
        </View>
        {progress !== undefined ? (
          <KinProgressRing progress={progress} size={44} strokeWidth={5} color={accentColor} />
        ) : null}
      </View>
    </KinCard>
  );
}
