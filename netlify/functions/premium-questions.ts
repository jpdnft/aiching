import {
  clearArchivedPremiumQuestions,
  listArchivedPremiumQuestions,
  pruneArchivedPremiumQuestions,
  requireQuestionsAdmin,
} from './_shared/questionArchive';
import { getCorsHeaders } from './_shared/cors';

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: getQuestionsCorsHeaders(request),
      status: 204,
    });
  }

  try {
    requireQuestionsAdmin(request);
  } catch {
    return json({ error: 'Unauthorized.' }, 401, request);
  }

  if (request.method === 'GET') {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') ?? undefined;
    const questions = await listArchivedPremiumQuestions(prefix);

    return json({
      count: questions.length,
      questions,
    }, 200, request);
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url);
    const beforeDate = url.searchParams.get('before');

    if (beforeDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(beforeDate)) {
        return json({ error: 'before must be a YYYY-MM-DD date.' }, 400, request);
      }

      return json({
        deleted: await pruneArchivedPremiumQuestions(beforeDate),
      }, 200, request);
    }

    return json({
      deleted: await clearArchivedPremiumQuestions(),
    }, 200, request);
  }

  return json({ error: 'Method not allowed.' }, 405, request);
}

function json(body: Record<string, unknown>, status = 200, request?: Request): Response {
  return Response.json(body, {
    headers: {
      ...(request ? getQuestionsCorsHeaders(request) : {}),
    },
    status,
  });
}

function getQuestionsCorsHeaders(request: Request): Record<string, string> {
  return getCorsHeaders(request, {
    allowedOriginsEnv: process.env.ADMIN_ALLOWED_ORIGIN || process.env.AI_READING_ALLOWED_ORIGIN,
    allowedHeaders: 'Authorization, Content-Type',
    allowedMethods: 'GET, DELETE, OPTIONS',
  });
}
