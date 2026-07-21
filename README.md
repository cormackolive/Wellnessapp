# Kin

> Wellness, wherever you are.

Kin is a premium AI wellness concierge: a mobile app that turns health goals, current location, time of day, and remaining nutrition/movement targets into realistic, specific recommendations — not generic advice. Built with Expo Router, NativeWind, Supabase, and a provider-abstraction layer so every third-party integration (AI, places, payments, wearables) has a working mock and a documented path to going live.

## Stack

- **App**: Expo (React Native, SDK 57) + Expo Router + TypeScript
- **Styling**: NativeWind (Tailwind for RN) + a token-based `KinText`/theme system for exact typographic control
- **State**: Zustand (client/session state) + TanStack Query (server state)
- **Forms**: React Hook Form + Zod (validation schemas live alongside forms; onboarding uses a lighter config-driven form engine — see below)
- **Backend**: Supabase (Postgres, Auth, Storage, Edge Functions, RLS on every user-owned table)
- **AI**: Anthropic Claude, called from a Supabase Edge Function (the API key never ships in the client)
- **Testing**: Jest (`jest-expo` preset) for calculation/business logic

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key at minimum
npm start
```

Then press `i` (iOS simulator), `a` (Android emulator), or `w` (web) — or scan the QR code with Expo Go.

### Supabase setup

1. Create a project at supabase.com.
2. Run the migration: `supabase/migrations/0001_init.sql` (via the SQL editor, or `supabase db push` if you have the CLI linked).
3. Seed reference data (mock restaurants, activity classes, Calm sessions): `supabase/seed.sql`.
4. Put the project URL + anon key in `.env` as `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

Every user-owned table has row-level security scoped to `auth.uid()`. Reference/catalog tables (restaurants, menu items, activity venues/classes, workout types, Calm sessions) are intentionally left world-readable — they carry no private data.

### AI concierge (optional but recommended)

The mobile app never holds the Anthropic key. Deploy the two Edge Functions and set the key server-side:

```bash
supabase functions deploy ai-concierge
supabase functions deploy meal-analysis
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

Without this, `src/lib/ai/index.ts` automatically falls back to a realistic mock provider (`src/lib/ai/mockProvider.ts`) — the concierge and meal-photo flows still work, just with canned responses instead of live model calls.

### Places, payments, health (all optional, all mocked by default)

Every one of these has a real provider *interface*, a documented live adapter with exact setup steps in comments, and a working mock so the app is fully usable without the credentials:

| Capability | Mock (default) | Live adapter | File |
|---|---|---|---|
| Nearby restaurants/activities | Supabase-seeded data, scored by `src/utils/recommendationEngine.ts` | Mapbox | `src/lib/places/mapboxProvider.ts` |
| Subscriptions/paywall | Supabase `subscriptions` table | RevenueCat | `src/lib/payments/revenuecatProvider.ts` |
| Steps/sleep/recovery | Realistic static sample | Apple HealthKit | `src/lib/health/healthKitProvider.ts` |
| Steps/sleep/recovery (Android) | Realistic static sample | Android Health Connect | `src/lib/health/healthConnectProvider.ts` |

Each live adapter throws a clear "not implemented, see comments" error until wired up — the factory in each module's `index.ts` picks mock vs. live based on whether the relevant env var is set, so switching to live is a matter of adding the key and installing one native package (then `npx expo prebuild`, since these are native modules unavailable in Expo Go).

## Architecture

```
app/                    Expo Router file-based routes
  (auth)/                welcome, email, verify (OTP)
  (onboarding)/           intro, [step] (config-driven wizard), connected-apps,
                          permissions, generating, plan-preview
  (tabs)/                today, discover, progress, you, add (intercepted by
                          the bottom sheet, never actually navigated to)
  meal/, log/, calm/, discover/, concierge/, profile/
                          feature screens outside the tab shell
  paywall.tsx

src/
  components/            Kin* component library (buttons, cards, badges,
                          progress rings, mood selector, breathing orb,
                          bottom sheet, restaurant/activity cards, ...)
  theme/                 design tokens: colors, typography, spacing/shadows/motion
  data/                  onboarding step config, Calm session metadata, pricing
  lib/
    ai/, places/, payments/, health/
                          provider abstractions (interface + mock + live stub)
    supabase.ts, authActions.ts, onboardingActions.ts
  queries/                TanStack Query hooks (profile, subscription, today's
                          logs, mutations)
  store/                  Zustand: auth session, onboarding wizard state, meal draft
  utils/                  targets.ts (nutrition target calc w/ safety caps),
                          recommendationEngine.ts (scoring), with Jest tests
  types/                  Supabase row types, Discover recommendation types

supabase/
  migrations/0001_init.sql   full schema + RLS
  seed.sql                    mock restaurants/activities/Calm sessions
  functions/ai-concierge, meal-analysis
                               Deno Edge Functions holding the Anthropic key
```

### The onboarding engine

Rather than ~40 near-duplicate screen files, onboarding is config-driven: `src/data/onboardingSteps.ts` defines every question (category, title, fields, and a `shouldShow(answers)` branching predicate — e.g. weight-related questions only appear if the user's goal touches weight), and a single dynamic route (`app/(onboarding)/[step].tsx`) renders whichever step is active, computes progress against only the *currently visible* steps, and persists answers to a Zustand store (`src/store/onboardingStore.ts`, backed by AsyncStorage for save-and-resume). On completion, `src/lib/onboardingActions.ts` runs the answers through the nutrition target calculator and writes the generated profile, preferences, and targets to Supabase.

This covers every category in the product spec (identity, goals, weight/body, activity, workout preferences, nutrition + allergies, wellness concerns, sleep, mood/stress, hydration, supplements, lifestyle, connected apps, permissions) as real, working screens. Some closely-related fields are grouped onto one screen rather than one-field-per-screen everywhere, as a deliberate scope tradeoff for this pass — the config format makes splitting any of those further a config change, not a new screen to build.

### Safety guardrails that are actually enforced, not just described

- `src/utils/targets.ts`: energy targets never go below a safe floor per sex, and an unsafe requested timeline (e.g. losing 10kg in 4 weeks) is silently capped to a sustainable pace with a `safetyMessage` the UI surfaces — covered by unit tests including the exact "unsafe timeline" scenario.
- Allergen exclusion is a **hard gate** in `recommendationEngine.ts` (score = 0, filtered out entirely), not a soft preference — also unit tested.
- Every restaurant recommendation carries a nutrition source label (Verified/Estimated/Unknown) and an allergy disclaimer.
- The Anthropic system prompt (`src/lib/ai/systemPrompt.ts`, duplicated server-side in the Edge Functions) explicitly forbids diagnosis, unsafe calorie targets, and shaming language, and instructs the model to redirect unsafe requests toward professional support.

## What's implemented (Phase 1 MVP)

Auth (email OTP live, Apple/Google OAuth wired), full onboarding, profile generation with real target calculation, paywall (mock entitlements), Today dashboard, Discover (Eat/Move tabs with live-scored mock recommendations), meal photo capture + AI analysis + editable review, manual meal entry, water/workout/weight/sleep/mood logging, Calm library + breathing sessions + post-session feedback, AI concierge chat, Progress (weight/mood charts, weekly reflection), and settings (tracking preferences, notifications, subscription, privacy/data, help).

## Known gaps / next steps

- **Barcode scanning and supplement logging** are in the data model and Add-sheet types but don't have screens yet.
- **Discover's "Reset" tab** links to the Calm library rather than having its own recommendation cards.
- **Weekly report screen** (section 32) isn't built yet — Progress shows a lightweight inline reflection instead.
- **HealthKit/Health Connect, Mapbox, and RevenueCat** are mocked by default; see the table above for what's needed to go live.
- Onboarding groups some closely-related fields onto shared screens rather than strictly one field per screen (see above).
- No Storybook/component gallery screen yet.
- Android-specific polish (adaptive icon assets, Health Connect) is Phase 3 per the product spec.

## Testing

```bash
npm test        # Jest — currently covers nutrition target calculation and recommendation scoring
npm run typecheck
```
