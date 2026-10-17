import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sai-meera.web.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting state (In-memory, resets on Edge Function cold start, but good enough for simple throttle)
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipHits.get(ip);
  if (!record || now > record.resetAt) {
    // 1 hour window for 20 messages per session/IP
    ipHits.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 }); 
    return false;
  }
  if (record.count >= 20) {
    return true; // rate limited
  }
  record.count++;
  return false;
}

const SYSTEM_PROMPT = `You are a helpful, professional AI assistant for Sai Meera Digital Design, a premium printing and design agency based in Kumbakonam, Tamil Nadu (Est. 1962).

Business Info:
- Address: 60, Thukkampalayam St, Karna Kollai Agraharam, Kumbakonam, Tamil Nadu 612001.
- Contact: +91 95970 72660 | saimeeradd@gmail.com
- Hours: Mon - Sat: 9:00 AM to 8:00 PM. Closed on Sundays.
- Services: Hindu/Muslim/Christian Wedding Invitations, Flex Banners, Shop Boards, Roll-up Banners, Visiting Cards, Bill Books, Certificates, Menu Cards.
- Orders: Direct users to use the Enquiry form on the contact page or WhatsApp for placing actual orders.

Rules:
- Be concise, polite, and helpful.
- Do NOT make up prices or promise delivery times not mentioned.
- Do NOT provide markdown links that are not verified.
- Keep answers under 3-4 sentences.`;

serve(async (req) => {
  // Handle CORS preflight
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = origin.includes('localhost') || origin.includes('127.0.0.1') ? origin : 'https://sai-meera.web.app';
  
  const dynamicCors = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': allowedOrigin
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: dynamicCors });
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: 'You have reached the maximum number of messages (20) for this session.' }), {
      status: 429,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid message format' }), {
        status: 400,
        headers: { ...dynamicCors, 'Content-Type': 'application/json' },
      });
    }

    // Length cap on the last user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.content.length > 500) {
      return new Response(JSON.stringify({ error: 'Message exceeds the 500 character limit.' }), {
        status: 400,
        headers: { ...dynamicCors, 'Content-Type': 'application/json' },
      });
    }

    // Format for Gemini API
    const contents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const payload = {
      system_instruction: { parts: { text: SYSTEM_PROMPT } },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 250, // Keep responses short
        temperature: 0.7,
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error('Failed to communicate with AI provider');
    }

    const data = await response.json();
    const assistantMessage = data.candidates[0].content.parts[0].text;

    return new Response(JSON.stringify({ response: assistantMessage }), {
      status: 200,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Chat Assistant Error:', error.message);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...dynamicCors, 'Content-Type': 'application/json' },
    });
  }
});
