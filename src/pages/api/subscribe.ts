import type { APIRoute } from 'astro';

export const prerender = false;

// Simple in-memory rate limiter (per serverless instance)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Rate limiting by IP
    const ip = clientAddress || request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Origin check (CSRF protection)
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://rahul.dev',
      'http://localhost:4321',
      'http://localhost:4322',
      'http://localhost:4323',
      'http://localhost:4324',
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email } = await request.json();

    // Validate email: required, string, format, length
    if (
      !email ||
      typeof email !== 'string' ||
      email.length > 254 ||
      !EMAIL_RE.test(email)
    ) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check API key is configured
    const apiKey = import.meta.env.BUTTONDOWN_API_KEY;
    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Service unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, type: 'regular' }),
    });

    if (res.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return generic error (don't leak Buttondown's internal messages)
    return new Response(
      JSON.stringify({ error: 'Subscription failed. Please try again.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
