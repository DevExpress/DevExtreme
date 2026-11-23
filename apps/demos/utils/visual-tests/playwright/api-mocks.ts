import type { Page, Route } from '@playwright/test';
import type { MockRequest } from '../../../testing/apiMocks/types';
import { getCrossOriginHeaders, widgetsGalleryHandlers } from '../../../testing/apiMocks/widgetsGalleryHandlers';
import { xmlaRules } from '../../../testing/apiMocks/xmlaRules';

const GOOGLE_FONTS = /^https:\/\/fonts\.googleapis\.com\//;

// The handlers were written for TestCafe, which reports the method in lower case.
const toMockRequest = (route: Route): MockRequest => {
  const request = route.request();

  return {
    url: request.url(),
    method: request.method().toLowerCase(),
    body: request.postData() ?? undefined,
    headers: request.headers(),
  };
};

export async function mockApi(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const request = toMockRequest(route);
    const handler = widgetsGalleryHandlers.find((x) => x.matches(request));

    if (handler) {
      await route.fulfill({
        status: 200,
        headers: { ...getCrossOriginHeaders(request), 'content-type': 'application/json' },
        body: JSON.stringify(handler.respond(request)),
      });
      return;
    }

    const xmlaRule = xmlaRules.find((x) => x.matches(request));

    if (xmlaRule) {
      await route.fulfill({ status: 200, headers: xmlaRule.headers, body: xmlaRule.body });
      return;
    }

    await route.fallback();
  });

  // Material themes import Roboto from Google Fonts; without it they use the font installed on the machine.
  await page.route(GOOGLE_FONTS, (route) => route.fulfill({ contentType: 'text/css' }));
}
