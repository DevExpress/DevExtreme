import { expect, test as base } from '@playwright/test';
import { DEFAULT_BROWSER_SIZE, DEFAULT_THEME } from './helpers/const';
import { changeTheme, openTestPage, resetPageState } from './helpers/testPageUtils';

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

    await page.setViewportSize({ width, height });
    await openTestPage(page);
    await changeTheme(page, theme);
    await resetPageState(page);

    await use(page);

    expect(pageErrors, 'uncaught errors in the page').toEqual([]);
  },
});

export { expect } from '@playwright/test';
