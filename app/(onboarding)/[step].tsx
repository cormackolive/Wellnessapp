import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { KinButton, KinHeader, KinInput, KinOnboardingProgress, KinPill, KinSelectCard, KinText } from '@/components';
import { ONBOARDING_STEPS, getNextStepId, getStepIndex, getVisibleSteps } from '@/data/onboardingSteps';
import type { OnboardingField } from '@/data/onboardingTypes';
import { useOnboardingStore } from '@/store/onboardingStore';

function FieldEditor({
  field,
  value,
  onChange,
}: {
  field: OnboardingField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (field.type) {
    case 'text':
      return (
        <KinInput
          label={field.label}
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChangeText={onChange}
        />
      );

    case 'number':
      return (
        <KinInput
          label={field.label ? `${field.label}${field.suffix ? ` (${field.suffix})` : ''}` : undefined}
          placeholder={field.placeholder}
          keyboardType="numeric"
          value={value !== undefined && value !== null ? String(value) : ''}
          onChangeText={(text) => onChange(text ? Number(text.replace(/[^0-9.]/g, '')) : undefined)}
        />
      );

    case 'single-select':
      return (
        <View style={{ marginBottom: 8 }}>
          {field.label ? (
            <KinText variant="caption" color={colors.forest} style={{ marginBottom: 8 }}>
              {field.label.toUpperCase()}
            </KinText>
          ) : null}
          {field.options.map((opt) => (
            <KinSelectCard
              key={opt.value}
              title={opt.label}
              selected={value === opt.value}
              onPress={() => onChange(opt.value)}
            />
          ))}
        </View>
      );

    case 'multi-select': {
      const selected = (value as string[]) ?? [];
      return (
        <View style={{ marginBottom: 8 }}>
          {field.label ? (
            <KinText variant="caption" color={colors.forest} style={{ marginBottom: 8 }}>
              {field.label.toUpperCase()}
            </KinText>
          ) : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {field.options.map((opt) => (
              <KinPill
                key={opt.value}
                label={opt.label}
                selected={selected.includes(opt.value)}
                onPress={() =>
                  onChange(
                    selected.includes(opt.value)
                      ? selected.filter((v) => v !== opt.value)
                      : [...selected, opt.value]
                  )
                }
              />
            ))}
          </View>
        </View>
      );
    }

    case 'pills-scale': {
      const options = Array.from({ length: field.max - field.min + 1 }, (_, i) => field.min + i);
      return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {options.map((n, i) => (
            <KinPill
              key={n}
              label={field.labels?.[i] ?? String(n)}
              selected={value === n}
              onPress={() => onChange(n)}
            />
          ))}
        </View>
      );
    }

    case 'yes-no':
      return (
        <View style={{ marginBottom: 12 }}>
          {field.label ? (
            <KinText variant="caption" color={colors.forest} style={{ marginBottom: 8 }}>
              {field.label.toUpperCase()}
            </KinText>
          ) : null}
          <View style={{ flexDirection: 'row' }}>
            <KinPill label="Yes" selected={value === true} onPress={() => onChange(true)} />
            <KinPill label="No" selected={value === false} onPress={() => onChange(false)} />
          </View>
        </View>
      );

    default:
      return null;
  }
}

export default function OnboardingStepScreen() {
  const { step: stepId } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const { answers, update, setLastStep } = useOnboardingStore();

  const step = useMemo(() => ONBOARDING_STEPS.find((s) => s.id === stepId), [stepId]);
  const visibleSteps = useMemo(() => getVisibleSteps(answers), [answers]);
  const currentIndex = step ? getStepIndex(step.id, answers) : 0;

  // Local draft so a field's value only commits to the store on Continue.
  const [draft, setDraft] = useState<Record<string, unknown>>(() => {
    if (!step) return {};
    const initial: Record<string, unknown> = {};
    step.fields.forEach((f) => {
      initial[f.key] = (answers as any)[f.key];
    });
    return initial;
  });

  if (!step) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory, padding: 24 }}>
        <KinText variant="body" color={colors.ink}>
          That step doesn't exist.
        </KinText>
        <KinButton label="Back to start" onPress={() => router.replace('/(onboarding)/intro')} />
      </SafeAreaView>
    );
  }

  const handleContinue = () => {
    update(draft as any);
    setLastStep(step.id);
    const nextAnswers = { ...answers, ...draft } as typeof answers;
    const nextId = getNextStepId(step.id, nextAnswers);
    if (nextId) {
      router.push(`/(onboarding)/${nextId}`);
    } else {
      router.push('/(onboarding)/connected-apps');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.ivory }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <KinHeader showBack />
          <KinOnboardingProgress current={currentIndex} total={visibleSteps.length} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          <KinText variant="eyebrow" color={colors.sage}>
            {step.eyebrow}
          </KinText>
          <KinText variant="h1" color={colors.ink} style={{ marginTop: 8 }}>
            {step.title}
          </KinText>
          {step.subtitle ? (
            <KinText variant="body" color={colors.forest} style={{ marginTop: 8, marginBottom: 20 }}>
              {step.subtitle}
            </KinText>
          ) : (
            <View style={{ marginBottom: 12 }} />
          )}

          {step.fields.map((field) => (
            <View key={field.key as string} style={{ marginBottom: 12 }}>
              <FieldEditor
                field={field}
                value={draft[field.key as string]}
                onChange={(v) => setDraft((d) => ({ ...d, [field.key as string]: v }))}
              />
            </View>
          ))}
        </ScrollView>
        <View style={{ paddingHorizontal: 24, paddingBottom: 16 }}>
          <KinButton label="Continue" onPress={handleContinue} />
          {step.optional ? (
            <View style={{ marginTop: 8 }}>
              <KinButton label="Skip" variant="tertiary" onPress={handleContinue} />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
