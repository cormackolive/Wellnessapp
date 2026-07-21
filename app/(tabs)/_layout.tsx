import { useCallback, useRef } from 'react';
import { Pressable, View } from 'react-native';
import { Tabs } from 'expo-router';
import type BottomSheet from '@gorhom/bottom-sheet';
import { Sun, Compass, Plus, LineChart, User } from 'lucide-react-native';
import { colors } from '@/theme';
import { KinBottomSheet } from '@/components/KinBottomSheet';
import { AddSheetContent } from '@/components/AddSheetContent';
import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/queries/useProfile';

export default function TabsLayout() {
  const sheetRef = useRef<BottomSheet>(null);
  const session = useAuthStore((s) => s.session);
  const { data: profile } = useProfile(session?.user.id);

  const openSheet = useCallback(() => sheetRef.current?.expand(), []);
  const closeSheet = useCallback(() => sheetRef.current?.close(), []);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.moss,
          tabBarInactiveTintColor: colors.sage,
          tabBarStyle: {
            backgroundColor: colors.ivory,
            borderTopColor: colors.stone,
            height: 84,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
        }}
      >
        <Tabs.Screen
          name="today"
          options={{ title: 'Today', tabBarIcon: ({ color, size }) => <Sun color={color} size={size} strokeWidth={1.75} /> }}
        />
        <Tabs.Screen
          name="discover"
          options={{ title: 'Discover', tabBarIcon: ({ color, size }) => <Compass color={color} size={size} strokeWidth={1.75} /> }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarIcon: () => (
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.moss,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: -16,
                  shadowColor: colors.ink,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 16,
                  elevation: 6,
                }}
              >
                <Plus color={colors.white} size={24} strokeWidth={2} />
              </View>
            ),
            tabBarButton: (props) => <Pressable {...(props as any)} onPress={openSheet} />,
          }}
          listeners={{ tabPress: (e) => e.preventDefault() }}
        />
        <Tabs.Screen
          name="progress"
          options={{ title: 'Progress', tabBarIcon: ({ color, size }) => <LineChart color={color} size={size} strokeWidth={1.75} /> }}
        />
        <Tabs.Screen
          name="you"
          options={{ title: 'You', tabBarIcon: ({ color, size }) => <User color={color} size={size} strokeWidth={1.75} /> }}
        />
      </Tabs>

      <KinBottomSheet ref={sheetRef} snapPoints={['55%']}>
        <AddSheetContent
          onNavigate={closeSheet}
          trackWater={profile?.track_water}
          trackWorkouts={profile?.track_workouts}
          trackMood={profile?.track_mood}
          trackSleep={profile?.track_sleep}
        />
      </KinBottomSheet>
    </>
  );
}
