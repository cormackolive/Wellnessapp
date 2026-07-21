import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useAddWater } from '@/queries/useToday';

const AMOUNTS = [125, 250, 500, 750];

export default function AddWaterScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const addWater = useAddWater(session?.user.id);
  const [amount, setAmount] = useState(250);

  const handleSave = async () => {
    await addWater.mutateAsync(amount);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <KinHeader showBack title="Add water" />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <KinText variant="h1" color={colors.ink} style={{ textAlign: 'center', marginBottom: 24 }}>
          {amount} ml
        </KinText>
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          {AMOUNTS.map((a) => (
            <KinPill key={a} label={`${a} ml`} selected={amount === a} onPress={() => setAmount(a)} />
          ))}
        </View>
      </View>
      <View style={{ paddingBottom: 24 }}>
        <KinButton label="Save" onPress={handleSave} loading={addWater.isPending} />
      </View>
    </SafeAreaView>
  );
}
