import {
  generatePremiumReadingOnServer,
  PremiumReadingError,
  PremiumReadingRequest,
} from '@/core/aiReadings/premiumReadingServer';

export async function POST(request: Request): Promise<Response> {
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
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
