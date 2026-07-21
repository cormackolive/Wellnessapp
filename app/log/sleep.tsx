import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useAddSleep } from '@/queries/useToday';

export default function AddSleepScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const addSleep = useAddSleep(session?.user.id);
  const [hours, setHours] = useState('7.5');
  const [restfulness, setRestfulness] = useState<number>();

  const handleSave = async () => {
    const hoursValue = Number(hours) || 7.5;
    const sleepEnd = new Date();
    const sleepStart = new Date(sleepEnd.getTime() - hoursValue * 60 * 60 * 1000);
    await addSleep.mutateAsync({
      sleepStart: sleepStart.toISOString(),
      sleepEnd: sleepEnd.toISOString(),
      restfulness,
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <KinHeader showBack title="Add sleep" />
      <View style={{ marginTop: 12 }}>
        <KinInput label="Hours slept" keyboardType="numeric" value={hours} onChangeText={setHours} />
      </View>
      <KinText variant="caption" color={colors.forest} style={{ marginBottom: 8 }}>
        HOW RESTFUL DID IT FEEL?
      </KinText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <KinPill key={n} label={String(n)} selected={restfulness === n} onPress={() => setRestfulness(n)} />
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: 24 }}>
        <KinButton label="Save" onPress={handleSave} loading={addSleep.isPending} />
      </View>
    </SafeAreaView>
  );
}
