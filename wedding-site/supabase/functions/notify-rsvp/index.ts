// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFICATION_EMAIL = Deno.env.get('NOTIFICATION_EMAIL'); // Get this from secrets

Deno.serve(async (req) => {
  try {
    // 1. Parse the incoming webhook payload from Supabase
    const { record } = await req.json();

    // 2. Safeguard: Check if keys exist
    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      return new Response(
        JSON.stringify({ error: "Missing API keys or Email secrets" }), 
        { status: 500 }
      );
    }

    // 3. Request to Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Wedding RSVP <onboarding@resend.dev>',
        to: [NOTIFICATION_EMAIL], // Use the variable, not a string
        subject: `RSVP Update: ${record.id.substring(0, 8)}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.5;">
            <h2>New RSVP Update!</h2>
            <p><strong>Guest ID:</strong> <code>${record.id}</code></p>
            <p><strong>Status:</strong> ${record.attending ? '✅ Attending' : '❌ Declined'}</p>
            <p><strong>Dietary Notes:</strong> ${record.dietary || '<em>None provided</em>'}</p>
            <hr />
            <p style="font-size: 12px; color: #666;">Sent via Supabase Edge Functions</p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});