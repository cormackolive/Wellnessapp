import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinText } from '@/components';
import { sendEmailOtp } from '@/lib/authActions';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = EMAIL_REGEX.test(email.trim());

  const handleContinue = async () => {
    if (!isValid) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendEmailOtp(email.trim());
      router.push({ pathname: '/(auth)/verify', params: { email: email.trim() } });
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong sending your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingHorizontal: 24 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <KinHeader showBack />
        <View style={{ marginTop: 24 }}>
          <KinText variant="h1" color={colors.ink}>
            What's your email?
          </KinText>
          <KinText variant="body" color={colors.forest} style={{ marginTop: 8, marginBottom: 24 }}>
            We'll send a one-time code — no password to remember.
          </KinText>
          <KinInput
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={error ?? undefined}
          />
          <KinButton label="Continue" onPress={handleContinue} loading={loading} disabled={!isValid} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
