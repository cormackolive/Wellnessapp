import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinPill, KinText } from '@/components';
import { useAuthStore } from '@/store/authStore';
import { useAddWorkout } from '@/queries/useToday';

const WORKOUT_TYPES = ['Walking', 'Running', 'Strength training', 'Yoga', 'Cycling', 'HIIT', 'Swimming', 'Other'];

export default function AddWorkoutScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const addWorkout = useAddWorkout(session?.user.id);
  const [type, setType] = useState<string>();
  const [duration, setDuration] = useState('30');

  const handleSave = async () => {
    await addWorkout.mutateAsync({ durationMinutes: Number(duration) || 30, notes: type });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <KinHeader showBack title="Add workout" />
      <KinText variant="h3" color={colors.ink} style={{ marginTop: 12, marginBottom: 12 }}>
        What did you do?
      </KinText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {WORKOUT_TYPES.map((t) => (
          <KinPill key={t} label={t} selected={type === t} onPress={() => setType(t)} />
        ))}
      </View>
      <View style={{ marginTop: 20 }}>
        <KinInput label="Duration (minutes)" keyboardType="numeric" value={duration} onChangeText={setDuration} />
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ paddingBottom: 24 }}>
        <KinButton label="Save" onPress={handleSave} loading={addWorkout.isPending} />
      </View>
    </SafeAreaView>
  );
}
