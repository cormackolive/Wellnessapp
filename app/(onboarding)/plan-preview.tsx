import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinCard, KinEstimateBadge, KinText } from '@/components';
import { useOnboardingStore } from '@/store/onboardingStore';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
      <KinText variant="body" color={colors.forest}>
        {label}
      </KinText>
      <KinText variant="body" color={colors.ink}>
        {value}
      </KinText>
    </View>
  );
}

export default function PlanPreviewScreen() {
  const router = useRouter();
  const { generatedPlan, answers } = useOnboardingStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <KinText variant="eyebrow" color={colors.sage}>
          YOUR PLAN
        </KinText>
        <KinText variant="h1" color={colors.ink} style={{ marginTop: 8 }}>
          Here's where Kin will start.
        </KinText>
        <KinText variant="body" color={colors.forest} style={{ marginTop: 8, marginBottom: 20 }}>
          These are ranges, not rules — Kin adjusts as it learns your patterns. You can edit or hide any of this
          anytime from your profile.
        </KinText>

        {generatedPlan?.safetyAdjusted ? (
          <KinCard style={{ marginBottom: 16, backgroundColor: colors.celadon }}>
            <KinText variant="small" color={colors.ink}>
              {generatedPlan.safetyMessage}
            </KinText>
          </KinCard>
        ) : null}

        <KinCard style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <KinText variant="h3" color={colors.ink}>
              Nourish
            </KinText>
            <KinEstimateBadge />
          </View>
          {generatedPlan ? (
            <>
              <Row label="Energy" value={`${generatedPlan.energyMin}–${generatedPlan.energyMax} kcal`} />
              <Row label="Protein" value={`${generatedPlan.proteinGMin}–${generatedPlan.proteinGMax} g`} />
              <Row label="Carbohydrates" value={`${generatedPlan.carbsGMin}–${generatedPlan.carbsGMax} g`} />
              <Row label="Fat" value={`${generatedPlan.fatGMin}–${generatedPlan.fatGMax} g`} />
              <Row label="Fiber" value={`${generatedPlan.fiberG} g`} />
            </>
          ) : null}
        </KinCard>

        <KinCard style={{ marginBottom: 16 }}>
          <KinText variant="h3" color={colors.ink}>
            Hydrate
          </KinText>
          <Row label="Water" value={`${generatedPlan ? Math.round(generatedPlan.waterMl / 250) : '–'} glasses`} />
        </KinCard>

        <KinCard>
          <KinText variant="h3" color={colors.ink}>
            Move
          </KinText>
          <Row label="Sessions per week" value={`${answers.daysExercisedPerWeek ?? 3}`} />
          <Row label="Preferred styles" value={answers.favoriteWorkouts.slice(0, 2).join(', ') || 'Still exploring'} />
        </KinCard>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
        <KinButton label="Continue" onPress={() => router.push('/paywall')} />
      </View>
    </SafeAreaView>
  );
}
