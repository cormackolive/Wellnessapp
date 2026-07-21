import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useAddWeight } from '@/queries/useToday';

export default function AddWeightScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const addWeight = useAddWeight(session?.user.id);
  const [weight, setWeight] = useState('');

  const handleSave = async () => {
    const value = Number(weight);
    if (!value) return;
    await addWeight.mutateAsync({ weightKg: value });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <KinHeader showBack title="Add weight" />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <KinText variant="body" color={colors.forest} style={{ marginBottom: 16, textAlign: 'center' }}>
          Your progress is flexible — this is just one data point.
        </KinText>
        <KinInput placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} style={{ textAlign: 'center', fontSize: 20 }} />
      </View>
      <View style={{ paddingBottom: 24 }}>
        <KinButton label="Save" onPress={handleSave} disabled={!weight} loading={addWeight.isPending} />
      </View>
    </SafeAreaView>
  );
}
