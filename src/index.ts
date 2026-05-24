/**
 * RM-Solution Worker
 *
 * Entry point del Cloudflare Worker che serve il sito statico (Astro)
 * e gestisce la route /api/contact per il form di contatto.
 *
 * Architettura:
 *   - Richieste a /api/contact (POST) → handler interno → Resend API
 *   - Qualunque altra richiesta → asset statici Astro (cartella dist/)
 *
 * Environment variables (configurate su Cloudflare → Variables and Secrets):
 *   - RESEND_API_KEY: API key Resend (Secret)
 *   - CONTACT_TO_EMAIL: destinatario (es. info@rm-solution.it)
 *   - CONTACT_FROM_EMAIL: mittente (es. noreply@send.rm-solution.it)
 */

interface Env {
  ASSETS: Fetcher;
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface ContactFormData {
  name?: string;
  company?: string;
  email?: string;
  role?: string;
  message?: string;
  website?: string; // honeypot anti-bot
}

// Utility: escape HTML per prevenire injection nelle email
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Utility: validazione email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length < 254;
}

// Utility: risposta JSON
function jsonResponse(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Handler dedicato al form contatti
 */
async function handleContact(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  // Method check
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    });
  }

  // Configurazione mancante
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    console.error('Missing required environment variables');
    return jsonResponse(
      { error: 'Server configuration error. Contact info@rm-solution.it directly.' },
      500
    );
  }

  // Parse body
  let data: ContactFormData;
  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = {
        name: formData.get('name')?.toString(),
        company: formData.get('company')?.toString(),
        email: formData.get('email')?.toString(),
        role: formData.get('role')?.toString(),
        message: formData.get('message')?.toString(),
        website: formData.get('website')?.toString(),
      };
    }
  } catch (e) {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  // Honeypot — bot che riempiono il campo "website" vengono ignorati silenziosamente
  if (data.website && data.website.length > 0) {
    console.log('Honeypot triggered, ignoring submission');
    return Response.redirect(`${baseUrl}/contatti/grazie/`, 303);
  }

  // Validazione
  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();

  if (!name || name.length < 2 || name.length > 100) {
    return jsonResponse({ error: 'Nome non valido' }, 400);
  }
  if (!email || !isValidEmail(email)) {
    return jsonResponse({ error: 'Email non valida' }, 400);
  }
  if (!message || message.length < 10 || message.length > 5000) {
    return jsonResponse({ error: 'Messaggio non valido (minimo 10 caratteri)' }, 400);
  }

  const company = data.company?.trim().slice(0, 200) || '—';
  const role = data.role?.trim().slice(0, 100) || '—';

  // Costruzione email
  const subject = `Nuova richiesta da ${name} (${company})`;

  const htmlBody = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0c1424;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;">
    <div style="border-bottom:2px solid #1e90ff;padding-bottom:16px;margin-bottom:24px;">
      <div style="font-size:11px;color:#8898aa;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">RM-Solution · Form contatti</div>
      <h1 style="margin:8px 0 0 0;font-size:22px;color:#0c1424;font-weight:600;">Nuova richiesta di contatto</h1>
    </div>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;color:#8898aa;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:140px;">Nome</td>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;font-size:14px;font-weight:500;">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;color:#8898aa;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Email</td>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#0c70d9;text-decoration:none;">${escapeHtml(email)}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;color:#8898aa;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Azienda</td>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;font-size:14px;">${escapeHtml(company)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;color:#8898aa;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Ruolo</td>
        <td style="padding:12px 0;border-bottom:1px solid #e0e7ee;font-size:14px;">${escapeHtml(role)}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:20px;background:#f6f9fc;border-left:3px solid #1e90ff;border-radius:4px;">
      <div style="color:#8898aa;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;margin-bottom:12px;">Messaggio</div>
      <div style="font-size:14px;line-height:1.65;color:#0c1424;white-space:pre-wrap;">${escapeHtml(message)}</div>
    </div>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e7ee;font-size:11px;color:#8898aa;line-height:1.6;">
      Email inviata dal form contatti di www.rm-solution.it<br>
      Ricevuta il ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })} (Europe/Rome)
    </div>
  </div>
</body>
</html>`;

  const textBody = [
    'RM-SOLUTION — Nuova richiesta dal form contatti',
    '═══════════════════════════════════════════',
    '',
    `Nome:    ${name}`,
    `Email:   ${email}`,
    `Azienda: ${company}`,
    `Ruolo:   ${role}`,
    '',
    'Messaggio:',
    '─────────────────',
    message,
    '',
    '═══════════════════════════════════════════',
    `Ricevuta il ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}`,
  ].join('\n');

  // Invio a Resend
  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `RM-Solution Sito Web <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', resendResponse.status, errorText);
      return jsonResponse(
        { error: 'Impossibile inviare il messaggio. Scrivi a info@rm-solution.it' },
        502
      );
    }

    // Successo → redirect alla pagina di grazie
    return Response.redirect(`${baseUrl}/contatti/grazie/`, 303);
  } catch (e) {
    console.error('Fetch to Resend failed:', e);
    return jsonResponse(
      { error: 'Errore di rete. Riprova tra qualche minuto.' },
      503
    );
  }
}

/**
 * Worker entry point: intercetta /api/contact, delega tutto il resto a ASSETS
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Route API: form contatti
    if (url.pathname === '/api/contact' || url.pathname === '/api/contact/') {
      return handleContact(request, env);
    }

    // Tutto il resto: serve gli static assets generati da Astro
    return env.ASSETS.fetch(request);
  },
};
