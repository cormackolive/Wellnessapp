import { View } from 'react-native';
import { colors } from '@/theme';
import { KinText } from './KinText';

function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <KinText variant="caption" color={fg}>
        {label}
      </KinText>
    </View>
  );
}

export function KinEstimateBadge() {
  return <Badge label="Estimated" bg={colors.oat} fg={colors.forest} />;
}

export function KinVerifiedBadge() {
  return <Badge label="Verified" bg={colors.celadon} fg={colors.moss} />;
}

export function KinSourceLabel({ source }: { source: 'Verified' | 'Estimated' | 'Unknown' }) {
  const config = {
    Verified: { bg: colors.celadon, fg: colors.moss },
    Estimated: { bg: colors.oat, fg: colors.forest },
    Unknown: { bg: colors.stone, fg: colors.ink },
  }[source];
  return <Badge label={source} bg={config.bg} fg={config.fg} />;
}

export function KinAllergyAlert({ text }: { text?: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.blush,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <KinText variant="small" color={colors.ink} style={{ flex: 1 }}>
        {text ??
          'Restaurant preparation and cross-contact practices can vary. Confirm severe allergies directly with the restaurant.'}
      </KinText>
    </View>
  );
}
