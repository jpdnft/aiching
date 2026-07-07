import {
  clearArchivedPremiumQuestions,
  listArchivedPremiumQuestions,
  pruneArchivedPremiumQuestions,
  requireQuestionsAdmin,
} from './_shared/questionArchive';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': process.env.ADMIN_ALLOWED_ORIGIN || process.env.AI_READING_ALLOWED_ORIGIN || '*',
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    requireQuestionsAdmin(request);
  } catch {
    return json({ error: 'Unauthorized.' }, 401);
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') ?? undefined;
    const questions = await listArchivedPremiumQuestions(prefix);

    return json({
      count: questions.length,
      questions,
    });
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const beforeDate = url.searchParams.get('before');

    if (beforeDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(beforeDate)) {
        return json({ error: 'before must be a YYYY-MM-DD date.' }, 400);
      }

      return json({
        deleted: await pruneArchivedPremiumQuestions(beforeDate),
      });
    }

    return json({
      deleted: await clearArchivedPremiumQuestions(),
    });
  }

  return json({ error: 'Method not allowed.' }, 405);
}

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    headers: {
      ...corsHeaders,
    },
    status,
  });
}
