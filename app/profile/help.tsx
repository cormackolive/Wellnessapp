import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinCard, KinHeader, KinText } from '@/components';

const FAQS = [
  { q: 'Are Kin\'s nutrition numbers exact?', a: 'No. Photo and menu estimates are ranges, not lab measurements. Verified sources are labeled separately.' },
  { q: 'Does Kin diagnose medical conditions?', a: 'No. Kin offers wellness guidance, not medical or mental-health diagnosis or treatment.' },
  { q: 'Can I hide calories or weight?', a: 'Yes — go to Tracking preferences and turn off any metric you don\'t want to see.' },
  { q: 'How does Kin protect severe allergies?', a: 'Kin excludes known allergens where possible and flags every restaurant recommendation, but always confirm directly with the restaurant for severe allergies.' },
];

export default function HelpScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <View style={{ paddingHorizontal: 24 }}>
        <KinHeader showBack title="Help and support" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8 }}>
        {FAQS.map((item) => (
          <KinCard key={item.q} style={{ marginBottom: 12 }}>
            <KinText variant="h3" color={colors.ink}>
              {item.q}
            </KinText>
            <KinText variant="small" color={colors.forest} style={{ marginTop: 6 }}>
              {item.a}
            </KinText>
          </KinCard>
        ))}
        <KinText variant="small" color={colors.sage} style={{ textAlign: 'center', marginTop: 12 }}>
          Still need help? Reach us at support@kin.app
        </KinText>
      </ScrollView>
    </SafeAreaView>
  );
}
