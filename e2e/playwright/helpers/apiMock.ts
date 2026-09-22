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
      const crossOrigin = {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': '*',
        'access-control-allow-headers': '*',
      };

      if (route.request().method() === 'OPTIONS') {
        await route.fulfill({ status: 204, headers: crossOrigin });
        return;
      }

      await route.fulfill({
        status,
        contentType: 'application/json',
        headers: { ...crossOrigin, ...headers },
        body: JSON.stringify(body),
      });
    });
  }
}
