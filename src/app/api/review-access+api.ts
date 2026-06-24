import {
  ReviewAccessError,
  ReviewAccessRequest,
  validateReviewAccessRequest,
} from '@/core/reviewAccess/reviewAccessServer';

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as ReviewAccessRequest | null;

  try {
    return json(validateReviewAccessRequest(body));
  } catch (error) {
    if (error instanceof ReviewAccessError) {
      return json({ granted: false, message: error.message }, error.status);
    }

    return json({ granted: false, message: 'Reviewer access is unavailable right now.' }, 500);
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
