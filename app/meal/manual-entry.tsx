import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useAddMeal } from '@/queries/useToday';
import type { Meal } from '@/types/database';

const MEAL_TYPES: Meal['meal_type'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function ManualMealEntryScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const addMeal = useAddMeal(session?.user.id);

  const [mealType, setMealType] = useState<Meal['meal_type']>('lunch');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const handleSave = async () => {
    await addMeal.mutateAsync({
      mealType,
      source: 'manual',
      calorieMin: Number(calories) || undefined,
      calorieMax: Number(calories) || undefined,
      proteinG: Number(protein) || undefined,
      carbsG: Number(carbs) || undefined,
      fatG: Number(fat) || undefined,
      items: name ? [{ name }] : [],
    });
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Add meal manually" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <KinText variant="caption" color={colors.sage} style={{ marginBottom: 8 }}>
          MEAL TYPE
        </KinText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {MEAL_TYPES.map((t) => (
            <KinPill key={t} label={t!} selected={mealType === t} onPress={() => setMealType(t)} />
          ))}
        </View>
        <KinInput label="What did you eat?" placeholder="e.g. Chicken shawarma bowl" value={name} onChangeText={setName} />
        <KinInput label="Calories" keyboardType="numeric" value={calories} onChangeText={setCalories} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <KinInput label="Protein (g)" keyboardType="numeric" value={protein} onChangeText={setProtein} />
          </View>
          <View style={{ flex: 1 }}>
            <KinInput label="Carbs (g)" keyboardType="numeric" value={carbs} onChangeText={setCarbs} />
          </View>
          <View style={{ flex: 1 }}>
            <KinInput label="Fat (g)" keyboardType="numeric" value={fat} onChangeText={setFat} />
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <KinButton label="Save meal" onPress={handleSave} disabled={!name} loading={addMeal.isPending} />
      </View>
    </SafeAreaView>
  );
}
