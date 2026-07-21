import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera as CameraIcon, Image as ImageIcon } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinIconButton, KinLoadingState, KinText } from '@/components';
import { aiProvider } from '@/lib/ai';
import { useMealDraftStore } from '@/store/mealDraftStore';

export default function MealCameraScreen() {
  const router = useRouter();
  const setDraft = useMealDraftStore((s) => s.setDraft);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (base64: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await aiProvider.analyzeMealPhoto(base64, {});
      setDraft(base64, result);
      router.replace('/meal/result');
    } catch (err: any) {
      setError(err?.message ?? 'We could not read this meal clearly. Try another angle or enter it manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const pickFrom = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Permission is needed to continue.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.6 })
        : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.6 });

    if (!result.canceled && result.assets[0]?.base64) {
      analyze(result.assets[0].base64);
    }
  };

  if (analyzing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, justifyContent: 'center' }}>
        <KinLoadingState label="Reading your meal…" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, paddingHorizontal: 24 }}>
      <KinHeader showBack title="Photograph a meal" />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <KinText variant="body" color={colors.forest} style={{ textAlign: 'center', marginBottom: 24 }}>
          Frame the plate from above in good light for the best estimate.
        </KinText>
        {error ? (
          <KinText variant="small" color={colors.error} style={{ textAlign: 'center', marginBottom: 16 }}>
            {error}
          </KinText>
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignItems: 'center', marginRight: 32 }}>
            <KinIconButton icon={CameraIcon} size={64} onPress={() => pickFrom('camera')} background={colors.celadon} />
            <KinText variant="caption" color={colors.forest} style={{ marginTop: 8 }}>
              Camera
            </KinText>
          </View>
          <View style={{ alignItems: 'center' }}>
            <KinIconButton icon={ImageIcon} size={64} onPress={() => pickFrom('library')} background={colors.oat} />
            <KinText variant="caption" color={colors.forest} style={{ marginTop: 8 }}>
              Library
            </KinText>
          </View>
        </View>
      </View>
      <View style={{ paddingBottom: 24 }}>
        <KinButton label="Enter manually instead" variant="tertiary" onPress={() => router.replace('/meal/manual-entry')} />
      </View>
    </SafeAreaView>
  );
}
