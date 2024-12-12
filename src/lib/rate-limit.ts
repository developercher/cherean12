export function rateLimit({ interval, uniqueTokenPerInterval = 500 }) {
  const tokenCache = new Map();
  let lastReset = Date.now();

  return {
    check: async (request: Request, limit: number, token: string) => {
      const now = Date.now();
      if (now - lastReset > interval) {
        tokenCache.clear();
        lastReset = now;
      }

      const key = token + ':' + request.headers.get('x-forwarded-for');
      const tokenCount = (tokenCache.get(key) || 0) + 1;

      tokenCache.set(key, tokenCount);

      if (tokenCount > limit) {
        throw new Error('Rate limit exceeded');
      }
    }
  };
} 