import {
  ReviewAccessError,
  ReviewAccessRequest,
  validateReviewAccessRequest,
} from '../../src/core/reviewAccess/reviewAccessServer';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type, X-AI-Ching-Client',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': process.env.REVIEW_ACCESS_ALLOWED_ORIGIN || '*',
};

const maxRequestBodyBytes = 2 * 1024;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 10;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  if (request.method !== 'POST') {
    return json({ granted: false, message: 'Method not allowed.' }, 405);
  }

  const rateLimit = checkRateLimit(getClientIdentifier(request));

  if (!rateLimit.allowed) {
    return json(
      { granted: false, message: 'Too many reviewer access attempts. Please try again soon.' },
      429,
      { 'Retry-After': String(rateLimit.retryAfterSeconds) },
    );
  }

  const requestText = await request.text();

  if (requestText.length > maxRequestBodyBytes) {
    return json({ granted: false, message: 'Request body is too large.' }, 413);
  }

  try {
    return json(validateReviewAccessRequest(parseJson(requestText)));
  } catch (error) {
    if (error instanceof ReviewAccessError) {
      return json({ granted: false, message: error.message }, error.status);
    }

    return json({ granted: false, message: 'Reviewer access is unavailable right now.' }, 500);
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

function parseJson(requestText: string): ReviewAccessRequest | null {
  if (!requestText) {
    return null;
  }

  try {
    return JSON.parse(requestText) as ReviewAccessRequest;
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
