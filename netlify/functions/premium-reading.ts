import {
  generatePremiumReadingOnServer,
  PremiumReadingError,
  PremiumReadingRequest,
} from '../../src/core/aiReadings/premiumReadingServer';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': process.env.AI_READING_ALLOWED_ORIGIN || '*',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  const body = (await request.json().catch(() => null)) as PremiumReadingRequest | null;

  try {
    return json(await generatePremiumReadingOnServer(body));
  } catch (error) {
    if (error instanceof PremiumReadingError) {
      return json({ error: error.message }, error.status);
    }

    return json({ error: 'Unable to generate the premium reading.' }, 500);
  }
}

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    headers: corsHeaders,
    status,
  });
}
