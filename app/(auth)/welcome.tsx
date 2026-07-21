import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as AppleAuthentication from 'expo-apple-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients } from '@/theme';
import { KinText, KinButton } from '@/components';
import { signInWithAppleIdentityToken, signInWithOAuthProvider } from '@/lib/authActions';

export default function WelcomeScreen() {
  const router = useRouter();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<'apple' | 'google' | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
    }
  }, []);

  const handleApple = async () => {
    setError(null);
    setLoadingProvider('apple');
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        await signInWithAppleIdentityToken(credential.identityToken);
      }
    } catch (err: any) {
      if (err?.code !== 'ERR_REQUEST_CANCELED') {
        setError('Apple sign-in is not available in this environment yet.');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoadingProvider('google');
    try {
      await signInWithOAuthProvider('google');
    } catch {
      setError('Google sign-in requires the OAuth provider to be configured in Supabase. Try email instead.');
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={gradients.primary} style={{ position: 'absolute', inset: 0 }} />
      <SafeAreaView style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 24 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View entering={FadeIn.duration(650)}>
            <KinText variant="displayXl" color={colors.ink} style={{ letterSpacing: -1.2 }}>
              kin
            </KinText>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(650).delay(200)}>
            <KinText variant="bodyLarge" color={colors.forest} style={{ marginTop: 12, textAlign: 'center' }}>
              Wellness, wherever you are.
            </KinText>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.duration(550).delay(350)}>
          {error ? (
            <KinText variant="small" color={colors.error} style={{ textAlign: 'center', marginBottom: 12 }}>
              {error}
            </KinText>
          ) : null}

          {appleAvailable ? (
            <View style={{ marginBottom: 10 }}>
              <KinButton
                label="Continue with Apple"
                variant="primary"
                onPress={handleApple}
                loading={loadingProvider === 'apple'}
              />
            </View>
          ) : null}

          <View style={{ marginBottom: 10 }}>
            <KinButton
              label="Continue with Google"
              variant="secondary"
              onPress={handleGoogle}
              loading={loadingProvider === 'google'}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <KinButton label="Continue with email" variant="tertiary" onPress={() => router.push('/(auth)/email')} />
          </View>

          <KinText variant="caption" color={colors.forest} style={{ textAlign: 'center' }}>
            By continuing, you agree to Kin's Terms and Privacy Policy.
          </KinText>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
