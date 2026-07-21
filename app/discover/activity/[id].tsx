import { Linking, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinText } from '@/components';
import { supabase } from '@/lib/supabase';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: item, isLoading } = useQuery({
    queryKey: ['activity-class', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_classes')
        .select('*, activity_venues(name, address)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !item) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, padding: 24 }}>
        <KinHeader showBack />
      </SafeAreaView>
    );
  }

  const venue = (item as any).activity_venues;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          {venue?.name}
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8 }}>
          {item.name}
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginTop: 8 }}>
          {item.duration_minutes} minutes · {item.difficulty} · ${item.price}
        </KinText>
        {item.starts_at ? (
          <KinText variant="body" color={colors.forest} style={{ marginTop: 4 }}>
            Starts {new Date(item.starts_at).toLocaleString([], { hour: 'numeric', minute: '2-digit' })}
          </KinText>
        ) : null}

        <View style={{ marginTop: 24 }}>
          <KinButton
            label="Open in Maps"
            variant="secondary"
            onPress={() => Linking.openURL(`https://maps.apple.com/?q=${encodeURIComponent(venue?.name ?? '')}`)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
