import type { Page } from '@playwright/test';

export interface MockedRequest {
  url: RegExp | string;
  body?: unknown;
  status?: number;
  headers?: Record<string, string>;
  contentType?: string;
  // Narrows the rule the way the TestCafe "onRequestTo" predicate did: an XMLA endpoint answers
  // every call on the same URL and only the request body says which answer is wanted.
  method?: string;
  matchBody?: (body: string) => boolean;
}

const DEFAULT_CONTENT_TYPE = 'application/json';

const serializeBody = (body: unknown, contentType: string): string => {
  if (contentType === DEFAULT_CONTENT_TYPE) {
    return JSON.stringify(body);
  }

  return typeof body === 'string' ? body : '';
};

// Replaces the TestCafe RequestMock: the rules are matched in the order they are declared, so a
// narrower rule has to come before the wider one, just as it did there. Registration runs backwards
// because "page.route" gives the last registered handler priority.
export async function mockApi(page: Page, requests: MockedRequest[]): Promise<void> {
  for (const {
    url, body, status = 200, headers, contentType = DEFAULT_CONTENT_TYPE, method, matchBody,
  } of [...requests].reverse()) {
    await page.route(url, async (route, request) => {
      const methodMatches = method === undefined
        || method.toLowerCase() === request.method().toLowerCase();
      const bodyMatches = matchBody === undefined || matchBody(request.postData() ?? '');

      if (!methodMatches || !bodyMatches) {
        await route.fallback();
        return;
      }

      await route.fulfill({
        status,
        contentType,
        headers: { 'access-control-allow-origin': '*', ...headers },
        body: serializeBody(body, contentType),
      });
    });
  }
}
