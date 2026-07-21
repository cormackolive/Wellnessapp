// Supabase Edge Function (Deno runtime).
// Deploy: supabase functions deploy ai-concierge
// Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Holds the Anthropic key server-side. The mobile client only ever calls
// this function via supabase.functions.invoke('ai-concierge', ...) with the
// user's session JWT attached — it never sees the API key.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const KIN_CONCIERGE_SYSTEM_PROMPT = `You are Kin, a calm and practical wellness concierge. Your job is to help the user make realistic, supportive choices based on their goals, preferences, current context, and permitted wellness data.

Prioritize actions the user can genuinely take now. Be concise, warm, specific, and transparent. Never shame the user or label food as morally good or bad.

Treat nutrition calculations, photograph analysis, calorie estimates, restaurant nutrition, energy expenditure, wearable interpretations, and timeline projections as estimates unless verified data is available. Clearly distinguish verified information from estimates.

Respect dietary restrictions and allergies. Never guarantee that a restaurant meal is free from allergens or cross-contact.

Do not diagnose medical or mental-health conditions. Do not provide medication instructions. Do not encourage starvation, purging, compulsive exercise, rapid weight loss, or compensatory exercise.

When a user expresses a potentially unsafe goal, redirect toward a gradual and supportive approach. Encourage qualified professional help when the request involves medical treatment, severe symptoms, eating-disorder behavior, pregnancy-specific needs, or other high-risk circumstances.

Use the user's enabled preferences. Do not mention metrics the user has hidden. Offer no more than three strong recommendations at once unless the user asks for more.

When recommending an action, briefly explain why it fits the user's current context. Focus on the next helpful step rather than perfection.`;

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), { status: 401 });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { history, context } = await req.json();

    const contextLines: string[] = [];
    if (context?.firstName) contextLines.push(`First name: ${context.firstName}`);
    if (context?.primaryGoal) contextLines.push(`Primary goal: ${context.primaryGoal}`);
    if (context?.showCalories && context?.remainingCalories) {
      contextLines.push(`Remaining calories today: ${context.remainingCalories.min}-${context.remainingCalories.max} kcal`);
    }
    if (context?.remainingProteinG !== undefined) contextLines.push(`Remaining protein today: ${context.remainingProteinG}g`);
    if (context?.mood) contextLines.push(`Current mood: ${context.mood}`);
    if (context?.stressLevel) contextLines.push(`Stress level (1-5): ${context.stressLevel}`);
    if (context?.sleepHours !== undefined) contextLines.push(`Sleep last night: ${context.sleepHours}h`);
    if (context?.locationLabel) contextLines.push(`Location: ${context.locationLabel}`);
    if (context?.budget !== undefined) contextLines.push(`Budget: $${context.budget}`);
    if (context?.minutesAvailable !== undefined) contextLines.push(`Minutes available: ${context.minutesAvailable}`);
    if (context?.allergies?.length) contextLines.push(`Allergies: ${context.allergies.join(', ')}`);

    const systemPrompt = contextLines.length
      ? `${KIN_CONCIERGE_SYSTEM_PROMPT}\n\nCurrent user context:\n${contextLines.join('\n')}`
      : KIN_CONCIERGE_SYSTEM_PROMPT;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 512,
        system: systemPrompt,
        messages: (history ?? []).map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      return new Response(JSON.stringify({ error: `Anthropic error: ${errText}` }), { status: 502 });
    }

    const result = await anthropicResponse.json();
    const message = result.content?.[0]?.text ?? '';

    return new Response(JSON.stringify({ message }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
