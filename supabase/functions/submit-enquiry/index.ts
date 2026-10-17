import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sai-meera.web.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_ENQUIRIES_PER_HOUR = 5;
const VALID_SERVICES = new Set([
  'offset', 'flex', 'invitations', 'greeting',
  'visiting-cards', 'photo-frames', 'stickers',
  'photoshop', 'other'
]);

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Generate client hash for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';
    
    // Hash IP + UA
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + ua);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const clientIdHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 2. Rate Limiting via Postgres RPC or manual check
    // Upsert rate limit record
    const { data: rlData, error: rlError } = await supabase
      .from('rate_limits')
      .select('enquiries_count, last_enquiry_at')
      .eq('client_id_hash', clientIdHash)
      .single();

    let count = 0;
    const now = new Date();
    if (rlData && rlData.last_enquiry_at) {
      const lastEnquiry = new Date(rlData.last_enquiry_at);
      // Reset if more than 1 hour passed
      if (now.getTime() - lastEnquiry.getTime() < 3600000) {
        count = rlData.enquiries_count;
      }
    }

    if (count >= MAX_ENQUIRIES_PER_HOUR) {
      return new Response(JSON.stringify({ error: 'Too many submissions. Please try again later.' }), { status: 429, headers: corsHeaders });
    }

    await supabase
      .from('rate_limits')
      .upsert({ 
        client_id_hash: clientIdHash, 
        enquiries_count: count + 1,
        last_enquiry_at: now.toISOString()
      }, { onConflict: 'client_id_hash' });

    // 3. Validate Payload
    const body = await req.json();
    const name = body.name?.trim().substring(0, 200);
    const email = body.email?.trim().substring(0, 320);
    const phone = body.phone?.replace(/[^0-9+]/g, '').substring(0, 20);
    const service = body.service?.trim().substring(0, 50);
    const message = body.message?.trim().substring(0, 5000);
    const company = body.company?.trim().substring(0, 200) || null;
    const categorySlug = body.categorySlug?.trim().substring(0, 100) || null;

    if (!name || !email || !phone || !service || !VALID_SERVICES.has(service) || !message) {
      return new Response(JSON.stringify({ error: 'Invalid submission format or missing fields.' }), { status: 400, headers: corsHeaders });
    }

    // 4. Create Enquiry
    const { data: enquiry, error: insertError } = await supabase
      .from('enquiries')
      .insert({
        name, email, phone, company, service, message, category_slug: categorySlug,
        client_id_hash: clientIdHash
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    // 5. Send Resend Email
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const html = `
          <h2>New Enquiry from ${name}</h2>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 15px;">${message.replace(/\n/g, '<br>')}</blockquote>
          <p><small>Enquiry ID: ${enquiry.id}</small></p>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: "Sai Meera Website <noreply@saimeera.in>",
            to: Deno.env.get('NOTIFICATION_EMAIL') || "print@saimeera.in",
            subject: `New Enquiry: ${service} — ${name}`,
            html: html
          })
        });
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
        // Do not fail the overall enquiry submission
      }
    }

    return new Response(JSON.stringify({ success: true, enquiryId: enquiry.id }), { headers: corsHeaders });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Submission failed. Please try again later.' }), { status: 500, headers: corsHeaders });
  }
});
