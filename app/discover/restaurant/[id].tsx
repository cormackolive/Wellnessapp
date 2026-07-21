import { Linking, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme';
import { KinAllergyAlert, KinButton, KinHeader, KinSourceLabel, KinText } from '@/components';
import { supabase } from '@/lib/supabase';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: item, isLoading } = useQuery({
    queryKey: ['menu-item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('restaurant_menu_items')
        .select('*, restaurants(name, address, rating)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !item) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, padding: 24 }}>
        <KinHeader showBack />
      </SafeAreaView>
    );
  }

  const restaurant = (item as any).restaurants;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          {restaurant?.name}
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8 }}>
          {item.name}
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginTop: 8 }}>
          {item.description}
        </KinText>

        <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
          <KinSourceLabel source={item.nutrition_source} />
        </View>

        <View style={{ marginTop: 12 }}>
          <KinText variant="body" color={colors.ink}>
            {item.calorie_min}–{item.calorie_max} kcal · {item.protein_g}g protein · {item.carbs_g}g carbs ·{' '}
            {item.fat_g}g fat
          </KinText>
          <KinText variant="body" color={colors.forest} style={{ marginTop: 4 }}>
            ${item.price}
          </KinText>
        </View>

        {item.allergens?.length > 0 ? (
          <View style={{ marginTop: 16 }}>
            <KinAllergyAlert text={`Contains: ${item.allergens.join(', ')}. Restaurant preparation and cross-contact practices can vary. Confirm severe allergies directly with the restaurant.`} />
          </View>
        ) : null}

        <View style={{ marginTop: 24 }}>
          <KinButton
            label="Open in Maps"
            variant="secondary"
            onPress={() =>
              Linking.openURL(
                `https://maps.apple.com/?q=${encodeURIComponent(restaurant?.name ?? '')}`
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
