import { expect, test as base } from '@playwright/test';
import { DEFAULT_BROWSER_SIZE, DEFAULT_THEME } from './helpers/const';
import { changeTheme, openTestPage, resetPageState } from './helpers/testPageUtils';

const GOOGLE_FONTS = /^https:\/\/fonts\.googleapis\.com\//;

export interface TestOptions {
  theme: string;
  browserSize: [number, number];
}

// Overriding "page" gives every test the prepared container page, the way the TestCafe runner did
// it from its global test hooks. Nothing needs cleaning up afterwards: every test gets its own
// context, and the widgets of the previous one die with its page.
export const test = base.extend<TestOptions>({
  theme: [DEFAULT_THEME, { option: true }],
  browserSize: [DEFAULT_BROWSER_SIZE, { option: true }],

  page: async ({ page, theme, browserSize }, use) => {
    const [width, height] = browserSize;
    // TestCafe failed a test on an uncaught error in the page; some tests assert nothing else.
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));

    // The Material themes import Roboto from Google Fonts, and what it serves is out of our hands:
    // some CI runs got a variable font instead of the static files, and text of weight 500 came out
    // a few pixels different. Without the import, the theme uses the Roboto it bundles.
    await page.context().route(GOOGLE_FONTS, (route) => route.fulfill({ contentType: 'text/css' }));

    await page.setViewportSize({ width, height });
    await openTestPage(page);
    await changeTheme(page, theme);
    await resetPageState(page);

    await use(page);

    expect(pageErrors, 'uncaught errors in the page').toEqual([]);
  },
});

export { expect } from '@playwright/test';
