import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container-extended.html')}`;

test.describe('HtmlEditor: AIDialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('initial state with-no-options', async ({ page }) => {
    // skipped: requires openAIDialog helper, HtmlEditor page object
  });

  test.skip('initial state with-options', async ({ page }) => {
    // skipped: requires openAIDialog helper, HtmlEditor page object
  });

  test.skip('resize window when initial state', async ({ page }) => {
    // skipped: requires openAIDialog, resizeWindow, HtmlEditor page object
  });

  test.skip('generating state', async ({ page }) => {
    // skipped: requires openAIDialog helper
  });

  test.skip('resultReady state with short-result', async ({ page }) => {
    // skipped: requires openAIDialog, HtmlEditor page object with getAIDialog
  });

  test.skip('resultReady state with long-result', async ({ page }) => {
    // skipped: requires openAIDialog, HtmlEditor page object with getAIDialog
  });

  test.skip('asking state', async ({ page }) => {
    // skipped: requires openAIDialog helper
  });

  test.skip('askAI result ready state', async ({ page }) => {
    // skipped: requires openAIDialog, HtmlEditor page object with getAIDialog
  });

  test.skip('result ready after canceletion', async ({ page }) => {
    // skipped: requires openAIDialog, HtmlEditor page object with getAIDialog
  });

  test.skip('error state', async ({ page }) => {
    // skipped: requires openAIDialog helper
  });

  ['initial', 'generating', 'result-ready', 'error'].forEach((state) => {
    test.skip(`${state} state on small screen`, async ({ page }) => {
      // skipped: requires openAIDialog helper
    });
  });
});
