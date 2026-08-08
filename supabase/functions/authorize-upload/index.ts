import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sai-meera.web.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_UPLOADS_PER_HOUR = 15;
const MAX_UPLOADS_PER_ENQUIRY = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ENQUIRY_UPLOAD_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

const ALLOWED_MIME_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/heic', 'heic'],
  ['image/heif', 'heif'],
  ['application/pdf', 'pdf'],
]);

serve(async (req) => {
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

    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';
    
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + ua);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const clientIdHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data: rlData } = await supabase
      .from('rate_limits')
      .select('uploads_count, last_upload_at')
      .eq('client_id_hash', clientIdHash)
      .single();

    let count = 0;
    const now = new Date();
    if (rlData && rlData.last_upload_at) {
      const lastUpload = new Date(rlData.last_upload_at);
      if (now.getTime() - lastUpload.getTime() < 3600000) {
        count = rlData.uploads_count;
      }
    }

    if (count >= MAX_UPLOADS_PER_HOUR) {
      return new Response(JSON.stringify({ error: 'Too many upload requests. Please try again later.' }), { status: 429, headers: corsHeaders });
    }

    await supabase
      .from('rate_limits')
      .upsert({ 
        client_id_hash: clientIdHash, 
        uploads_count: count + 1,
        last_upload_at: now.toISOString()
      }, { onConflict: 'client_id_hash' });

    // 2. Request Validation
    const body = await req.json();
    const enquiryId = body.enquiryId?.trim().substring(0, 40);
    const contentType = body.contentType?.trim().substring(0, 50);
    const fileSize = Number(body.fileSize);

    if (!enquiryId || !contentType || !ALLOWED_MIME_TYPES.has(contentType)) {
      return new Response(JSON.stringify({ error: 'Invalid file type or request format.' }), { status: 400, headers: corsHeaders });
    }

    if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ error: 'File too large. Maximum 50 MB.' }), { status: 400, headers: corsHeaders });
    }

    // 3. Verify Enquiry
    const { data: enquiry, error: enquiryError } = await supabase
      .from('enquiries')
      .select('created_at, upload_count, upload_paths')
      .eq('id', enquiryId)
      .single();

    if (enquiryError || !enquiry) {
      return new Response(JSON.stringify({ error: 'Invalid enquiry reference.' }), { status: 400, headers: corsHeaders });
    }

    const createdAt = new Date(enquiry.created_at);
    if (now.getTime() - createdAt.getTime() > ENQUIRY_UPLOAD_WINDOW_MS) {
      return new Response(JSON.stringify({ error: 'Upload window has expired. Please submit a new enquiry.' }), { status: 400, headers: corsHeaders });
    }

    if (enquiry.upload_count >= MAX_UPLOADS_PER_ENQUIRY) {
      return new Response(JSON.stringify({ error: `Maximum ${MAX_UPLOADS_PER_ENQUIRY} files allowed per enquiry.` }), { status: 400, headers: corsHeaders });
    }

    // 4. Generate Path and Signed URL
    const ext = ALLOWED_MIME_TYPES.get(contentType);
    const uuid = crypto.randomUUID();
    const storagePath = `${enquiryId}/${uuid}.${ext}`;

    const { data: signedData, error: signedError } = await supabase
      .storage
      .from('enquiry-uploads')
      .createSignedUploadUrl(storagePath);

    if (signedError || !signedData) {
      throw signedError || new Error("Failed to generate signed URL");
    }

    // 5. Update Enquiry Record
    const newPaths = [...(enquiry.upload_paths || []), storagePath];
    await supabase
      .from('enquiries')
      .update({
        upload_count: enquiry.upload_count + 1,
        upload_paths: newPaths,
        updated_at: now.toISOString()
      })
      .eq('id', enquiryId);

    return new Response(JSON.stringify({
      success: true,
      signedUrl: signedData.signedUrl,
      token: signedData.token,
      storagePath: storagePath
    }), { headers: corsHeaders });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Upload authorization failed.' }), { status: 500, headers: corsHeaders });
  }
});
