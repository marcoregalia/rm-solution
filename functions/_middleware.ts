const WP_PATTERNS = [
  '/wp-login',
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/xmlrpc',
];

export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  if (WP_PATTERNS.some((pattern) => path.startsWith(pattern))) {
    return new Response('Not found', { status: 404 });
  }

  // handle /?p= query param (WordPress post ID URLs)
  if (url.searchParams.has('p')) {
    return new Response('Not found', { status: 404 });
  }

  return context.next();
}
