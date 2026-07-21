// Supabase Edge Function (Deno runtime).
// Deploy: supabase functions deploy meal-analysis
// Secret: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Analyzes a meal photo with Claude's vision capability and returns an
// editable nutrition estimate. Never claims exact precision — the client
// always labels this as "Estimated from your photo."

import { createClient } from 'jsr:@supabase/supabase-js@2';

const ANALYSIS_PROMPT = `You are estimating nutrition from a meal photo for a wellness app called Kin. Identify the likely foods and estimate a calorie range and macros. Be honest about uncertainty — use "low", "moderate", or "high" confidence. Respond with ONLY valid JSON matching this shape, no other text:
{
  "identifiedFoods": string[],
  "calorieMin": number,
  "calorieMax": number,
  "proteinG": number,
  "carbsG": number,
  "fatG": number,
  "fiberG": number,
  "confidence": "low" | "moderate" | "high"
}`;

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

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: 'imageBase64 is required' }), { status: 400 });
    }

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
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ANALYSIS_PROMPT },
              {
                type: 'image',
                source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 },
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      return new Response(JSON.stringify({ error: `Anthropic error: ${errText}` }), { status: 502 });
    }

    const result = await anthropicResponse.json();
    const text = result.content?.[0]?.text ?? '{}';
    const parsed = JSON.parse(text);

    return new Response(JSON.stringify(parsed), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
