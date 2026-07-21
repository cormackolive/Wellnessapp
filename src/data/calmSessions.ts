import type { BreathingPhase } from '@/components/KinBreathingOrb';

export type CalmSessionMeta = {
  slug: string;
  title: string;
  category: string;
  durationSeconds: number;
  description: string;
  phases: BreathingPhase[];
  instructionLines: string[];
};

const BOX_PHASES: BreathingPhase[] = [
  { label: 'Breathe in', durationMs: 4000, scale: 1 },
  { label: 'Hold', durationMs: 4000, scale: 1 },
  { label: 'Breathe out', durationMs: 4000, scale: 0.7 },
  { label: 'Hold', durationMs: 4000, scale: 0.7 },
];

const EXTENDED_EXHALE_PHASES: BreathingPhase[] = [
  { label: 'Breathe in', durationMs: 3000, scale: 1 },
  { label: 'Breathe out, slowly', durationMs: 6000, scale: 0.7 },
];

const SIMPLE_PHASES: BreathingPhase[] = [
  { label: 'Breathe in', durationMs: 4000, scale: 1 },
  { label: 'Breathe out', durationMs: 5000, scale: 0.7 },
];

export const CALM_SESSIONS: CalmSessionMeta[] = [
  { slug: 'one-minute-reset', title: 'One-Minute Reset', category: 'quick', durationSeconds: 60, description: 'A brief pause to settle your breath.', phases: SIMPLE_PHASES, instructionLines: ['Read slowly,', 'breathe gently.'] },
  { slug: 'three-minute-breathing', title: 'Three-Minute Breathing', category: 'breathing', durationSeconds: 180, description: 'Gentle paced breathing to slow down.', phases: SIMPLE_PHASES, instructionLines: ['Breathe in.', 'Breathe out.'] },
  { slug: 'five-minute-breathing', title: 'Five-Minute Breathing', category: 'breathing', durationSeconds: 300, description: 'Extended paced breathing for a deeper reset.', phases: SIMPLE_PHASES, instructionLines: ['Breathe in.', 'Breathe out.'] },
  { slug: 'box-breathing', title: 'Box Breathing', category: 'breathing', durationSeconds: 240, description: 'Equal-count inhale, hold, exhale, hold.', phases: BOX_PHASES, instructionLines: ['In. Hold.', 'Out. Hold.'] },
  { slug: 'extended-exhale', title: 'Extended-Exhale Breathing', category: 'breathing', durationSeconds: 180, description: "Longer exhales to support the body's calming response.", phases: EXTENDED_EXHALE_PHASES, instructionLines: ['Breathe in.', 'Be still.', 'Breathe out.'] },
  { slug: 'grounding-exercise', title: 'Grounding Exercise', category: 'grounding', durationSeconds: 240, description: 'Reconnect with your senses and the present moment.', phases: SIMPLE_PHASES, instructionLines: ['Notice where you are.', 'Breathe.'] },
  { slug: 'body-scan', title: 'Body Scan', category: 'mindfulness', durationSeconds: 420, description: 'A slow scan of physical sensation from head to toe.', phases: SIMPLE_PHASES, instructionLines: ['Notice your body.', 'Let it soften.'] },
  { slug: 'walking-meditation', title: 'Walking Meditation', category: 'mindfulness', durationSeconds: 300, description: 'Mindful movement at an easy pace.', phases: SIMPLE_PHASES, instructionLines: ['Feel each step.', 'No need to rush.'] },
  { slug: 'post-workout-reset', title: 'Post-Workout Reset', category: 'recovery', durationSeconds: 180, description: "Settle your nervous system after exertion.", phases: EXTENDED_EXHALE_PHASES, instructionLines: ['Let your breath slow.', 'You did enough.'] },
  { slug: 'pre-sleep-winddown', title: 'Pre-Sleep Wind-Down', category: 'sleep', durationSeconds: 360, description: 'Ease the transition into rest.', phases: EXTENDED_EXHALE_PHASES, instructionLines: ['The day is done.', 'Let go.'] },
  { slug: 'focus-reset', title: 'Focus Reset', category: 'focus', durationSeconds: 120, description: 'A short reset to return attention to the task at hand.', phases: SIMPLE_PHASES, instructionLines: ['Come back to now.', 'One thing at a time.'] },
  { slug: 'gentle-stretch', title: 'Gentle Stretch', category: 'movement', durationSeconds: 300, description: 'Light mobility to release tension.', phases: SIMPLE_PHASES, instructionLines: ['Move gently.', 'No need to push.'] },
  { slug: 'overwhelm-reset', title: 'Overwhelm Reset', category: 'grounding', durationSeconds: 180, description: 'Support for moments that feel like too much.', phases: EXTENDED_EXHALE_PHASES, instructionLines: ['This will pass.', 'Breathe with me.'] },
];

export function getCalmSession(slug: string) {
  return CALM_SESSIONS.find((s) => s.slug === slug);
}
