import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage, isMaterial, isMaterialBased } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Popup should not be closed if lookup is placed at the page bottom (T1018037)', async ({ page }) => {
    // skipped: requires Lookup page object with getInstance, open, isOpened
  });

  test.skip('Popup should be flipped if lookup is placed at the page bottom', async ({ page }) => {
    // skipped: requires ClientFunction, getBoundingClientRectProperty
  });

  test.skip('Popover should have correct vertical position (T1048128)', async ({ page }) => {
    // skipped: requires Lookup page object with open, getBoundingClientRectProperty
  });

  test.skip('Check popup height with no found data option', async ({ page }) => {
    // skipped: requires hover helper
  });

  test.skip('Check popup height in loading state', async ({ page }) => {
    // skipped: requires hover helper
  });

  test.skip('Lookup appearance', async ({ page }) => {
    // skipped: requires .before() setup with t.ctx.ids, Guid
  });
});
