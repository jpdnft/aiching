import {
  generatePremiumReadingOnServer,
  PremiumReadingError,
  PremiumReadingRequest,
} from '../../src/core/aiReadings/premiumReadingServer';
import { archivePremiumQuestion } from './_shared/questionArchive';
import {
  enforcePremiumUsageLimits,
  PremiumAccessError,
  requirePremiumAccess,
} from './_shared/premiumAccess';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-AI-Ching-Client',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': process.env.AI_READING_ALLOWED_ORIGIN || '*',
};

const maxRequestBodyBytes = 12 * 1024;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 12;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

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

  const rateLimit = checkRateLimit(getClientIdentifier(request));

  if (!rateLimit.allowed) {
    return json(
      { error: 'Too many premium reading requests. Please try again soon.' },
      429,
      { 'Retry-After': String(rateLimit.retryAfterSeconds) },
    );
  }

  const requestText = await request.text();

  if (requestText.length > maxRequestBodyBytes) {
    return json({ error: 'Request body is too large.' }, 413);
  }

  const body = parseJson(requestText);

  try {
    const access = await requirePremiumAccess(request);
    await enforcePremiumUsageLimits(access);

    const premiumReading = await generatePremiumReadingOnServer(body);

    await archivePremiumQuestion(body).catch((error) => {
      console.error('Unable to archive premium question.', getErrorMessage(error));
    });

    console.info('Premium reading generated.', {
      accessSource: access.source,
      hasQuestion: Boolean(body?.question),
      model: premiumReading.model,
    });

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

function checkRateLimit(clientIdentifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(clientIdentifier);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(clientIdentifier, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });

    return { allowed: true };
  }

  if (bucket.count >= rateLimitMaxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}

function getClientIdentifier(request: Request): string {
  return (
    request.headers.get('x-nf-client-connection-ip') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function parseJson(requestText: string): PremiumReadingRequest | null {
  if (!requestText) {
    return null;
  }

  try {
    return JSON.parse(requestText) as PremiumReadingRequest;
  } catch {
    return null;
  }
}

function json(
  body: Record<string, unknown>,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return Response.json(body, {
    headers: {
      ...corsHeaders,
      ...headers,
    },
    status,
  });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
