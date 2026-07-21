import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinText } from '@/components';
import { sendEmailOtp, verifyEmailOtp } from '@/lib/authActions';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (code.trim().length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyEmailOtp(email, code.trim());
      // Root layout's auth listener + app/index.tsx redirect handle navigation from here.
    } catch (err: any) {
      setError(err?.message ?? 'That code didn\'t work. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await sendEmailOtp(email);
    } catch (err: any) {
      setError(err?.message ?? 'Could not resend the code.');
    } finally {
      setResending(false);
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
            Check your email
          </KinText>
          <KinText variant="body" color={colors.forest} style={{ marginTop: 8, marginBottom: 24 }}>
            Enter the 6-digit code we sent to {email}.
          </KinText>
          <KinInput
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            error={error ?? undefined}
            style={{ letterSpacing: 8, textAlign: 'center', fontSize: 22 }}
          />
          <KinButton label="Verify" onPress={handleVerify} loading={loading} disabled={code.length < 6} />
          <View style={{ marginTop: 12 }}>
            <KinButton label="Resend code" variant="tertiary" onPress={handleResend} loading={resending} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
