import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import { MapPin, HeartPulse, Bell, CameraIcon } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinPermissionCard, KinText } from '@/components';
import { useOnboardingStore } from '@/store/onboardingStore';
import { healthProvider } from '@/lib/health';

export default function PermissionsScreen() {
  const router = useRouter();
  const { answers, update } = useOnboardingStore();
  const [granted, setGranted] = useState<Record<string, boolean>>({});

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const ok = status === 'granted';
    update({ locationPermissionGranted: ok });
    setGranted((g) => ({ ...g, location: ok }));
  };

  const requestHealth = async () => {
    const ok = await healthProvider.requestPermissions();
    update({ healthPermissionGranted: ok });
    setGranted((g) => ({ ...g, health: ok }));
  };

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    const ok = status === 'granted';
    update({ notificationsPermissionGranted: ok });
    setGranted((g) => ({ ...g, notifications: ok }));
  };

  const requestCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const ok = status === 'granted';
    update({ cameraPermissionGranted: ok });
    setGranted((g) => ({ ...g, camera: ok }));
  };

  const handleContinue = () => router.push('/(onboarding)/generating');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <KinHeader showBack />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          ONE LAST THING
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8, marginBottom: 20 }}>
          A few permissions, explained plainly.
        </KinText>

        <View style={{ marginBottom: 16 }}>
          <KinPermissionCard
            icon={MapPin}
            title="Location"
            body="To find meals and movement options that fit your day."
            onAllow={requestLocation}
          />
        </View>

        {answers.connectedProviders.length > 0 ? (
          <View style={{ marginBottom: 16 }}>
            <KinPermissionCard
              icon={HeartPulse}
              title="Health data"
              body="To personalize activity, sleep, and recovery insights."
              onAllow={requestHealth}
            />
          </View>
        ) : null}

        <View style={{ marginBottom: 16 }}>
          <KinPermissionCard
            icon={Bell}
            title="Notifications"
            body="For reminders you choose, never constant nudges."
            onAllow={requestNotifications}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <KinPermissionCard
            icon={CameraIcon}
            title="Camera"
            body="To estimate meals from photos."
            onAllow={requestCamera}
          />
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <KinButton label="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}
