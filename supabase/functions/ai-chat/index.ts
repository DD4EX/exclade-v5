const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, lang, history, localAnswer } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      // Fallback to local answer
      return new Response(JSON.stringify({ answer: localAnswer || 'AI not available' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const langName = lang === 'ta' ? 'Tamil' : lang === 'tl' ? 'Tanglish (Tamil in English letters)' : 'English';

    const systemPrompt = `You are a helpful government scheme assistant for villagers from A. Chithur village, Virudhachalam, Cuddalore District, Tamil Nadu, India.

IMPORTANT RULES:
- Always respond in ${langName}
- Keep answers simple and easy to understand for uneducated rural people
- Use short sentences
- If asked about a scheme, provide: name, benefits, eligibility, documents needed, how to apply
- Be warm and respectful, use "anna/akka" style addressing
- If you have local data, enhance it with more details
- Focus on Tamil Nadu and Central Government schemes
- Include office locations near Virudhachalam/Cuddalore when relevant
- If unsure, suggest visiting the nearest government office

LOCAL DATA (use this as base, enhance with your knowledge):
${localAnswer || 'No local match found'}

Respond helpfully based on the user's question. Keep it under 300 words.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ answer: localAnswer || 'Rate limited, please try again.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (response.status === 402) {
      return new Response(JSON.stringify({ answer: localAnswer || 'AI credits exhausted.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!response.ok) {
      console.error('AI gateway error:', response.status);
      return new Response(JSON.stringify({ answer: localAnswer || 'AI temporarily unavailable.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiAnswer = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ answer: aiAnswer || localAnswer }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
