import { Pressable, View, Image } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinCard } from './KinCard';
import { KinText } from './KinText';
import { KinSourceLabel, KinAllergyAlert } from './KinBadge';
import type { MealRecommendation } from '@/types/discover';

type Props = {
  meal: MealRecommendation;
  onPress?: () => void;
};

export function KinRestaurantCard({ meal, onPress }: Props) {
  const hasAllergens = meal.allergens.length > 0;

  return (
    <Pressable onPress={onPress}>
      <KinCard padded={false} style={{ overflow: 'hidden', marginBottom: 16 }}>
        {meal.imageUrl ? (
          <Image source={{ uri: meal.imageUrl }} style={{ width: '100%', height: 160 }} resizeMode="cover" />
        ) : (
          <View style={{ width: '100%', height: 160, backgroundColor: colors.celadon }} />
        )}
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <KinText variant="eyebrow" color={colors.sage}>
              {meal.restaurantName}
            </KinText>
            <KinSourceLabel source={meal.nutritionSource} />
          </View>
          <KinText variant="h3" color={colors.ink} style={{ marginTop: 4 }}>
            {meal.mealName}
          </KinText>

          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <KinText variant="body" color={colors.forest}>
              {meal.calorieMin}–{meal.calorieMax} kcal · {meal.protein}g protein · ${meal.price}
            </KinText>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Clock size={14} color={colors.sage} strokeWidth={1.75} />
            <KinText variant="small" color={colors.sage} style={{ marginLeft: 4, marginRight: 12 }}>
              {meal.etaMinMinutes}–{meal.etaMaxMinutes} min
            </KinText>
            <MapPin size={14} color={colors.sage} strokeWidth={1.75} />
            <KinText variant="small" color={colors.sage} style={{ marginLeft: 4 }}>
              {meal.distanceMiles} mi
            </KinText>
          </View>

          <View
            style={{
              marginTop: 12,
              backgroundColor: colors.ivory,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <KinText variant="caption" color={colors.sage}>
              WHY KIN CHOSE IT
            </KinText>
            <KinText variant="small" color={colors.ink} style={{ marginTop: 4 }}>
              {meal.reason}
            </KinText>
          </View>

          {hasAllergens ? (
            <View style={{ marginTop: 12 }}>
              <KinAllergyAlert />
            </View>
          ) : null}
        </View>
      </KinCard>
    </Pressable>
  );
}
