import '../global.css';
import { useEffect, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts as useBodoniModaFonts,
  BodoniModa_400Regular,
  BodoniModa_400Regular_Italic,
  BodoniModa_500Medium,
} from '@expo-google-fonts/bodoni-moda';
import {
  useFonts as useManropeFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [bodoniLoaded] = useBodoniModaFonts({
    BodoniModa_400Regular,
    BodoniModa_400Regular_Italic,
    BodoniModa_500Medium,
  });
  const [manropeLoaded] = useManropeFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  const init = useAuthStore((s) => s.init);
  const initializing = useAuthStore((s) => s.initializing);

  useEffect(() => {
    init();
  }, [init]);

  const fontsLoaded = bodoniLoaded && manropeLoaded;
  const ready = fontsLoaded && !initializing;

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.ivory },
              animation: 'fade',
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
