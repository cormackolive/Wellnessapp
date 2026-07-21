import { Pressable, View, Image } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinCard } from './KinCard';
import { KinText } from './KinText';
import type { ActivityRecommendation } from '@/types/discover';

type Props = {
  activity: ActivityRecommendation;
  onPress?: () => void;
};

export function KinActivityCard({ activity, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <KinCard padded={false} style={{ overflow: 'hidden', marginBottom: 16 }}>
        {activity.imageUrl ? (
          <Image source={{ uri: activity.imageUrl }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: 160, backgroundColor: colors.lilac }} />
        )}
        <View style={{ padding: 16 }}>
          <KinText variant="eyebrow" color={colors.sage}>
            {activity.venueName}
          </KinText>
          <KinText variant="h3" color={colors.ink} style={{ marginTop: 4 }}>
            {activity.className}
          </KinText>

          <KinText variant="body" color={colors.forest} style={{ marginTop: 8 }}>
            {activity.startTime} · {activity.durationMinutes} min · ${activity.price}
          </KinText>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Clock size={14} color={colors.sage} strokeWidth={1.75} />
            <KinText variant="small" color={colors.sage} style={{ marginLeft: 4, marginRight: 12 }}>
              {activity.difficulty}
            </KinText>
            <MapPin size={14} color={colors.sage} strokeWidth={1.75} />
            <KinText variant="small" color={colors.sage} style={{ marginLeft: 4 }}>
              {activity.distanceMiles} mi
            </KinText>
          </View>

          <View style={{ marginTop: 12, backgroundColor: colors.ivory, borderRadius: 12, padding: 12 }}>
            <KinText variant="caption" color={colors.sage}>
              WHY KIN CHOSE IT
            </KinText>
            <KinText variant="small" color={colors.ink} style={{ marginTop: 4 }}>
              {activity.reason}
            </KinText>
          </View>
        </View>
      </KinCard>
    </Pressable>
  );
}
