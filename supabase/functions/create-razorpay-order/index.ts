import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://sai-meera.web.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipHits.get(ip);
  if (!record || now > record.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + 60000 }); // 60 seconds window
    return false; // not limited
  }
  if (record.count >= 10) { // max 10 requests per minute per IP
    return true; // limited
  }
  record.count++;
  return false;
}

const PRICING_TABLE: Record<string, { name: string; tiers: Record<string, { price: number; minQty: number; unit: string }> }> = {
  'hindu-wedding': { name: 'Hindu Wedding Invitations', tiers: { 'Classic': { price: 8, minQty: 50, unit: 'card' }, 'Premium': { price: 18, minQty: 50, unit: 'card' }, 'Luxury': { price: 35, minQty: 100, unit: 'card' } } },
  'muslim-nikah': { name: 'Muslim Nikah Invitations', tiers: { 'Classic': { price: 8, minQty: 50, unit: 'card' }, 'Premium': { price: 18, minQty: 50, unit: 'card' }, 'Luxury': { price: 35, minQty: 100, unit: 'card' } } },
  'christian-wedding': { name: 'Christian Wedding Invitations', tiers: { 'Classic': { price: 8, minQty: 50, unit: 'card' }, 'Premium': { price: 16, minQty: 50, unit: 'card' }, 'Luxury': { price: 30, minQty: 100, unit: 'card' } } },
  'engagement': { name: 'Engagement Invitations', tiers: { 'Classic': { price: 8, minQty: 50, unit: 'card' }, 'Premium': { price: 16, minQty: 50, unit: 'card' }, 'Luxury': { price: 30, minQty: 100, unit: 'card' } } },
  'reception': { name: 'Reception Invitations', tiers: { 'Classic': { price: 8, minQty: 50, unit: 'card' }, 'Premium': { price: 18, minQty: 50, unit: 'card' }, 'Luxury': { price: 35, minQty: 100, unit: 'card' } } },
  'baby-shower': { name: 'Baby Shower / Seemantham', tiers: { 'Classic': { price: 10, minQty: 25, unit: 'card' }, 'Premium': { price: 18, minQty: 25, unit: 'card' }, 'Luxury': { price: 32, minQty: 50, unit: 'card' } } },
  'valaikaapu': { name: 'Valaikaapu Invitations', tiers: { 'Classic': { price: 10, minQty: 25, unit: 'card' }, 'Premium': { price: 20, minQty: 50, unit: 'card' }, 'Luxury': { price: 38, minQty: 100, unit: 'card' } } },
  'ear-piercing': { name: 'Ear Piercing / Kaadhukuthu', tiers: { 'Classic': { price: 8, minQty: 25, unit: 'card' }, 'Premium': { price: 15, minQty: 25, unit: 'card' }, 'Luxury': { price: 28, minQty: 50, unit: 'card' } } },
  'puberty-function': { name: 'Puberty / Manjal Neerattu Vizha', tiers: { 'Classic': { price: 8, minQty: 25, unit: 'card' }, 'Premium': { price: 15, minQty: 25, unit: 'card' }, 'Luxury': { price: 28, minQty: 50, unit: 'card' } } },
  'housewarming': { name: 'Housewarming / Gruhapravesam', tiers: { 'Classic': { price: 8, minQty: 25, unit: 'card' }, 'Premium': { price: 15, minQty: 25, unit: 'card' }, 'Luxury': { price: 28, minQty: 50, unit: 'card' } } },
  'birthday': { name: 'Birthday Invitations', tiers: { 'Classic': { price: 6, minQty: 25, unit: 'card' }, 'Premium': { price: 14, minQty: 25, unit: 'card' }, 'Luxury': { price: 25, minQty: 50, unit: 'card' } } },
  'anniversary': { name: 'Anniversary Invitations', tiers: { 'Classic': { price: 8, minQty: 25, unit: 'card' }, 'Premium': { price: 16, minQty: 25, unit: 'card' }, 'Luxury': { price: 30, minQty: 50, unit: 'card' } } },
  'naming-ceremony': { name: 'Naming Ceremony Invitations', tiers: { 'Classic': { price: 8, minQty: 25, unit: 'card' }, 'Premium': { price: 15, minQty: 25, unit: 'card' }, 'Luxury': { price: 28, minQty: 50, unit: 'card' } } },
  'temple-festival': { name: 'Temple & Festival Event Cards', tiers: { 'Classic': { price: 5, minQty: 100, unit: 'card' }, 'Premium': { price: 10, minQty: 100, unit: 'card' }, 'Luxury': { price: 20, minQty: 200, unit: 'card' } } },
  'funeral-memorial': { name: 'Funeral & Memorial Cards', tiers: { 'Standard': { price: 5, minQty: 25, unit: 'card' }, 'Premium': { price: 12, minQty: 25, unit: 'card' }, 'Tribute': { price: 22, minQty: 50, unit: 'card' } } },
  'flex-banner': { name: 'Flex Banners (Outdoor)', tiers: { 'Star Flex': { price: 12, minQty: 1, unit: 'sqft' }, 'Backlit Flex': { price: 22, minQty: 1, unit: 'sqft' }, 'Vinyl': { price: 18, minQty: 2, unit: 'sqft' } } },
  'wedding-flex': { name: 'Wedding Flex Backdrop', tiers: { 'Standard': { price: 18, minQty: 20, unit: 'sqft' }, 'Backlit': { price: 25, minQty: 20, unit: 'sqft' }, 'Premium': { price: 35, minQty: 20, unit: 'sqft' } } },
  'shop-opening': { name: 'Shop Opening Banners', tiers: { 'Banner': { price: 12, minQty: 4, unit: 'sqft' }, 'Sign Board': { price: 22, minQty: 6, unit: 'sqft' }, 'Hoarding': { price: 16, minQty: 50, unit: 'sqft' } } },
  'political-event': { name: 'Political & Public Event Flex', tiers: { 'Banner': { price: 12, minQty: 4, unit: 'sqft' }, 'Large': { price: 14, minQty: 20, unit: 'sqft' }, 'Hoarding': { price: 16, minQty: 50, unit: 'sqft' } } },
  'rollup-banner': { name: 'Roll-up Standee Banners', tiers: { 'Standard': { price: 1400, minQty: 1, unit: 'unit' }, 'Wide': { price: 1800, minQty: 1, unit: 'unit' }, 'Double-Sided': { price: 2200, minQty: 1, unit: 'unit' } } },
  'greeting-card': { name: 'Greeting Cards', tiers: { 'Classic': { price: 15, minQty: 10, unit: 'card' }, 'Premium': { price: 28, minQty: 10, unit: 'card' }, 'Corporate': { price: 12, minQty: 100, unit: 'card' } } },
  'visiting-card': { name: 'Visiting / Business Cards', tiers: { 'Standard': { price: 1.5, minQty: 100, unit: 'card' }, 'Premium': { price: 3, minQty: 50, unit: 'card' }, 'Luxury': { price: 6, minQty: 50, unit: 'card' } } },
  'thank-you-card': { name: 'Thank You Cards', tiers: { 'Classic': { price: 10, minQty: 25, unit: 'card' }, 'Premium': { price: 20, minQty: 25, unit: 'card' }, 'Photo': { price: 18, minQty: 25, unit: 'card' } } },
  'menu-card': { name: 'Menu Cards', tiers: { 'Standard': { price: 25, minQty: 20, unit: 'menu' }, 'Folded': { price: 35, minQty: 20, unit: 'menu' }, 'Event Gold': { price: 45, minQty: 50, unit: 'menu' } } },
  'certificate': { name: 'Certificates', tiers: { 'Standard': { price: 12, minQty: 10, unit: 'cert' }, 'Premium': { price: 25, minQty: 10, unit: 'cert' }, 'Foil Gold': { price: 45, minQty: 10, unit: 'cert' } } },
  'bill-book': { name: 'Bill Books', tiers: { 'Single-Part': { price: 80, minQty: 10, unit: 'book' }, 'Duplicate NCR': { price: 140, minQty: 10, unit: 'book' }, 'Triplicate NCR': { price: 190, minQty: 10, unit: 'book' } } },
  'school-college': { name: 'School & College Certificates', tiers: { 'Certificates': { price: 8, minQty: 50, unit: 'cert' } } },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
  if (checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') ?? '';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';

    if (!supabaseUrl || !supabaseServiceKey || !razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { enquiryId, categorySlug, tier, quantity } = await req.json();

    if (!enquiryId || !categorySlug || !tier || typeof quantity !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Lookup price
    const categoryInfo = PRICING_TABLE[categorySlug];
    if (!categoryInfo) {
      return new Response(JSON.stringify({ error: 'This product requires a custom quote. Please contact us.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tierInfo = categoryInfo.tiers[tier];
    if (!tierInfo) {
      return new Response(JSON.stringify({ error: 'This product requires a custom quote. Please contact us.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (quantity < tierInfo.minQty) {
      return new Response(JSON.stringify({ error: `Minimum quantity for this tier is ${tierInfo.minQty}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if enquiry exists
    const { data: enquiry, error: enquiryError } = await supabase
      .from('enquiries')
      .select('id')
      .eq('id', enquiryId)
      .single();

    if (enquiryError || !enquiry) {
      return new Response(JSON.stringify({ error: 'Enquiry not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const amount_paise = tierInfo.price * 100 * quantity;
    const receipt = `sai_meera_${enquiryId.substring(0, 8)}`;
    const currency = 'INR';

    // Call Razorpay API
    const authHeader = `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`;
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ amount: amount_paise, currency, receipt }),
    });

    if (!razorpayRes.ok) {
      console.error('Razorpay API error', await razorpayRes.text());
      throw new Error('Failed to create Razorpay order');
    }

    const rzpOrder = await razorpayRes.json();

    // Insert order into DB
    const { error: insertError } = await supabase.from('orders').insert({
      enquiry_id: enquiryId,
      razorpay_order_id: rzpOrder.id,
      amount_paise,
      currency,
      status: 'created',
      receipt,
      category_slug: categorySlug,
      tier,
      quantity,
      unit_price_paise: tierInfo.price * 100,
    });

    if (insertError) {
      console.error('Failed to insert order', insertError);
      throw new Error('Database error');
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderId: rzpOrder.id,
        razorpayOrderId: rzpOrder.id,
        amount: amount_paise,
        currency,
        key: razorpayKeyId,
        description: `${categoryInfo.name} × ${quantity}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Create Order Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
