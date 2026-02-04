import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { id, attending, dietary } = await req.json();

  try {
    await resend.emails.send({
      from: 'WeddingBot <onboarding@resend.dev>',
      to: process.env.NOTIFICATION_EMAIL,
      subject: `RSVP Update: ${id.substring(0, 8)}`,
      html: `<p>Guest <strong>${id}</strong> updated their RSVP.</p>
             <p>Attending: ${attending ? '✅ Yes' : '❌ No'}</p>
             <p>Dietary: ${dietary || 'None'}</p>`
    });
    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}