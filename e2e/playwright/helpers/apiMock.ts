import type { Page } from '@playwright/test';

export interface MockedRequest {
  url: RegExp | string;
  body: unknown;
  status?: number;
  headers?: Record<string, string>;
}

// Replaces the TestCafe RequestMock: the rules are matched in the order they are declared, so a
// narrower rule has to come before the wider one, just as it did there. Registration runs backwards
// because "page.route" gives the last registered handler priority.
export async function mockApi(page: Page, requests: MockedRequest[]): Promise<void> {
  for (const {
    url, body, status = 200, headers,
  } of [...requests].reverse()) {
    await page.route(url, async (route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*', ...headers },
        body: JSON.stringify(body),
      });
    });
  }
}
