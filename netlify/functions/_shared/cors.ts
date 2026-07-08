export type CorsOptions = {
  allowedOriginEnv?: string;
  allowedOriginsEnv?: string;
  allowedHeaders: string;
  allowedMethods: string;
};

export function getCorsHeaders(request: Request, options: CorsOptions): Record<string, string> {
  const requestOrigin = request.headers.get('origin')?.trim();
  const allowedOrigins = getAllowedOrigins(options.allowedOriginsEnv ?? options.allowedOriginEnv);
  const allowedOrigin = getAllowedOrigin(requestOrigin, allowedOrigins);

  return {
    'Access-Control-Allow-Headers': options.allowedHeaders,
    'Access-Control-Allow-Methods': options.allowedMethods,
    'Access-Control-Allow-Origin': allowedOrigin,
    Vary: 'Origin',
  };
}

function getAllowedOrigins(value: string | undefined): string[] {
  return (value || '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getAllowedOrigin(requestOrigin: string | undefined, allowedOrigins: string[]): string {
  if (allowedOrigins.includes('*')) {
    return '*';
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] || '*';
}
