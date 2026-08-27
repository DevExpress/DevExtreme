import type { Page } from '@playwright/test';

export interface MockedRequest {
  url: RegExp | string;
  body: unknown;
  status?: number;
  headers?: Record<string, string>;
}

// Replaces the TestCafe RequestMock: the rules are matched in the order they are declared,
// so a narrower rule has to come before the wider one, just as it did there.
export async function mockApi(page: Page, requests: MockedRequest[]): Promise<void> {
  await Promise.all(requests.map(({
    url, body, status = 200, headers,
  }) => page.route(url, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*', ...headers },
      body: JSON.stringify(body),
    });
  })));
}
