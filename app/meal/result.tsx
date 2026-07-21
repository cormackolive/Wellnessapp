import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinCard, KinEstimateBadge, KinHeader, KinInput, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useMealDraftStore } from '@/store/mealDraftStore';
import { useAddMeal } from '@/queries/useToday';
import type { Meal } from '@/types/database';

const MEAL_TYPES: Meal['meal_type'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function MealResultScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { analysis, imageBase64, clear } = useMealDraftStore();
  const addMeal = useAddMeal(session?.user.id);

  const [mealType, setMealType] = useState<Meal['meal_type']>('lunch');
  const [foods, setFoods] = useState(analysis?.identifiedFoods.join(', ') ?? '');
  const [calorieMin, setCalorieMin] = useState(String(analysis?.calorieMin ?? ''));
  const [calorieMax, setCalorieMax] = useState(String(analysis?.calorieMax ?? ''));
  const [protein, setProtein] = useState(String(analysis?.proteinG ?? ''));

  if (!analysis) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, padding: 24 }}>
        <KinText variant="body" color={colors.ink}>
          No meal to review. Try photographing a meal again.
        </KinText>
        <KinButton label="Back" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    await addMeal.mutateAsync({
      mealType,
      source: 'photo',
      calorieMin: Number(calorieMin) || undefined,
      calorieMax: Number(calorieMax) || undefined,
      proteinG: Number(protein) || undefined,
      carbsG: analysis.carbsG,
      fatG: analysis.fatG,
      fiberG: analysis.fiberG,
      confidence: analysis.confidence,
      items: foods.split(',').map((f) => ({ name: f.trim() })).filter((f) => f.name),
    });
    clear();
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Review your meal" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {imageBase64 ? (
          <View
            style={{ width: '100%', height: 180, borderRadius: 16, backgroundColor: colors.oat, marginBottom: 16, overflow: 'hidden' }}
          />
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <KinEstimateBadge />
          <KinText variant="caption" color={colors.sage} style={{ marginLeft: 8 }}>
            Estimated from your photo. Ingredients and portions may vary.
          </KinText>
        </View>

        <KinCard style={{ marginBottom: 16 }}>
          <KinText variant="caption" color={colors.sage} style={{ marginBottom: 8 }}>
            MEAL TYPE
          </KinText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {MEAL_TYPES.map((t) => (
              <KinPill key={t} label={t!} selected={mealType === t} onPress={() => setMealType(t)} />
            ))}
          </View>
        </KinCard>

        <KinInput label="Identified foods" value={foods} onChangeText={setFoods} multiline />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <KinInput label="Calories (min)" keyboardType="numeric" value={calorieMin} onChangeText={setCalorieMin} />
          </View>
          <View style={{ flex: 1 }}>
            <KinInput label="Calories (max)" keyboardType="numeric" value={calorieMax} onChangeText={setCalorieMax} />
          </View>
        </View>
        <KinInput label="Protein (g)" keyboardType="numeric" value={protein} onChangeText={setProtein} />

        <KinText variant="caption" color={colors.sage}>
          Confidence: {analysis.confidence}
        </KinText>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <KinButton label="Save meal" onPress={handleSave} loading={addMeal.isPending} />
      </View>
    </SafeAreaView>
  );
}
