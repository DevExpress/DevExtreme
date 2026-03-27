import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, HtmlEditor } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container-extended.html')}`;

const openAIDialog = async (page, htmlEditor: HtmlEditor) => {
  await htmlEditor.toolbar.getItemByName('ai').click();
};

test.describe('HtmlEditor: AIDialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 700 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('initial state with-no-options', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-initial-state-with-no-options.png');
  });

  test('initial state with-options', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
      ai: {
        enabled: true,
      },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-initial-state-with-options.png');
  });

  test('resize window when initial state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await page.setViewportSize({ width: 400, height: 400 });

    await testScreenshot(page, 'htmleditor-ai-dialog-initial-state-resize-window.png');
  });

  test('generating state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-generating-state.png');
  });

  test('resultReady state with short-result', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-result-ready-state-with-short-result.png');
  });

  test('resultReady state with long-result', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-result-ready-state-with-long-result.png');
  });

  test('asking state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-asking-state.png');
  });

  test('askAI result ready state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-ask-ai-result-ready-state.png');
  });

  test('result ready after canceletion', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-result-ready-after-canceletion.png');
  });

  test('error state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 400,
      width: 600,
      toolbar: { items: ['ai'] },
    });

    const htmlEditor = new HtmlEditor(page);
    await openAIDialog(page, htmlEditor);

    await testScreenshot(page, 'htmleditor-ai-dialog-error-state.png');
  });

  ['initial', 'generating', 'result-ready', 'error'].forEach((state) => {
    test(`${state} state on small screen`, async ({ page }) => {
      await page.setViewportSize({ width: 400, height: 500 });

      await createWidget(page, 'dxHtmlEditor', {
        height: 300,
        width: 380,
        toolbar: { items: ['ai'] },
      });

      const htmlEditor = new HtmlEditor(page);
      await openAIDialog(page, htmlEditor);

      await testScreenshot(page, `htmleditor-ai-dialog-${state}-state-on-small-screen.png`);
    });
  });
});
