import {
  generatePremiumReadingOnServer,
  PremiumReadingError,
  PremiumReadingRequest,
} from '@/core/aiReadings/premiumReadingServer';
import { archivePremiumQuestion } from '../../../netlify/functions/_shared/questionArchive';
import {
  enforcePremiumUsageLimits,
  PremiumAccessError,
  requirePremiumAccess,
} from '../../../netlify/functions/_shared/premiumAccess';

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as PremiumReadingRequest | null;

  try {
    const access = await requirePremiumAccess(request);
    await enforcePremiumUsageLimits(access);
    const premiumReading = await generatePremiumReadingOnServer(body);

    await archivePremiumQuestion(body).catch(() => undefined);

    return json(premiumReading);
  } catch (error) {
    if (error instanceof PremiumAccessError) {
      return json({ error: error.message }, error.status);
    }

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
