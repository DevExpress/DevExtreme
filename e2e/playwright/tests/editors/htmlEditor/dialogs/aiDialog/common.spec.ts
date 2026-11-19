import type { Page } from '@playwright/test';
import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import HtmlEditor from '../../../../../models/htmlEditor';
import { getLongText } from '../../../chat/data';

const MENU_ITEM_CLASS = 'dx-menu-item';
const SUBMENU_CLASS = 'dx-submenu';
const LOADINDICATOR_SEGMENT_CLASS = 'dx-loadindicator-segment';
const LOADINDICATOR_CONTENT_CLASS = 'dx-loadindicator-content';
const LOADINDICATOR_ICON_CLASS = 'dx-loadindicator-icon';
const LOADINDICATOR_SEGMENT_INNER_CLASS = 'dx-loadindicator-segment-inner';

const longResult = getLongText(false, 10);

interface AICallbacks {
  onComplete: (result: string) => void;
  onError: () => void;
}

const openAIDialog = async (
  page: Page,
  command: number,
  option?: number,
): Promise<HtmlEditor> => {
  const htmlEditor = new HtmlEditor(page, '#container');
  const commandItem = page.locator(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).nth(command);

  await htmlEditor.getToolbarItem('ai').element.click();
  await commandItem.click();

  if (option !== undefined) {
    await commandItem.locator(`.${SUBMENU_CLASS} .${MENU_ITEM_CLASS}`).first().click();
  }

  return htmlEditor;
};

test.describe('HtmlEditor: AIDialog', () => {
  [
    { name: 'with-no-options', command: 0, option: undefined },
    { name: 'with-options', command: 4, option: 0 },
  ].forEach(({ name, command, option }) => {
    test(`initial state ${name}`, async ({ page }) => {
      await createWidget(page, 'dxHtmlEditor', {
        height: 600,
        width: 900,
        aiIntegration: {},
        toolbar: {
          items: ['ai'],
        },
      });

      await openAIDialog(page, command, option);
      await testScreenshot(page, `htmleditor-ai-dialog-initial-state-${name}.png`, { element: '#container' });
    });
  });

  test('resize window when initial state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      aiIntegration: {},
      toolbar: {
        items: ['ai'],
      },
    });

    const htmlEditor = await openAIDialog(page, 0);

    await page.setViewportSize({ width: 400, height: 600 });

    await htmlEditor.aiDialog.getMenuButton().element.click();
    await testScreenshot(page, 'htmleditor-ai-dialog-initial-state-resize-window.png');
  });

  test('generating state', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `
      .${LOADINDICATOR_SEGMENT_CLASS},
      .${LOADINDICATOR_CONTENT_CLASS},
      .${LOADINDICATOR_ICON_CLASS},
      .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
        animation: none !important;
        opacity: 1 !important;
      }

      .${LOADINDICATOR_SEGMENT_CLASS} {
        transform: scale(1) !important;
      }
    `);

    await createWidget(page, 'dxHtmlEditor', () => ({
      height: 600,
      width: 900,
      aiIntegration: {
        changeStyle() {},
      },
      toolbar: {
        items: ['ai'],
      },
    }));

    await openAIDialog(page, 4, 0);
    await testScreenshot(page, 'htmleditor-ai-dialog-generating-state.png', { element: '#container' });
  });

  [
    {
      name: 'short-result',
      result: 'result',
    },
    {
      name: 'long-result',
      result: longResult,
    },
  ].forEach(({ name, result }) => {
    test(`resultReady state with ${name}`, async ({ page }) => {
      await createWidget(page, 'dxHtmlEditor', (aiResult) => ({
        height: 600,
        width: 900,
        aiIntegration: {
          result: aiResult,
          changeStyle(_: unknown, { onComplete }: AICallbacks) { onComplete(this.result); },
        },
        toolbar: {
          items: ['ai'],
        },
      }), '#container', { arg: result });

      const htmlEditor = await openAIDialog(page, 4, 0);

      await htmlEditor.aiDialog.getSplitButton().element.click();

      await testScreenshot(page, `htmleditor-ai-dialog-result-ready-state-with-${name}.png`, { element: '#container' });
    });
  });

  test('asking state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 900,
      aiIntegration: {},
      toolbar: {
        items: ['ai'],
      },
    });

    await openAIDialog(page, 7);
    await testScreenshot(page, 'htmleditor-ai-dialog-asking-state.png', { element: '#container' });
  });

  test('askAI result ready state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', (aiResult) => ({
      height: 600,
      width: 900,
      aiIntegration: {
        result: aiResult,
        execute(_: unknown, { onComplete }: AICallbacks) { onComplete(this.result); },
      },
      toolbar: {
        items: ['ai'],
      },
    }), '#container', { arg: longResult });

    const htmlEditor = await openAIDialog(page, 7);
    const { aiDialog } = htmlEditor;

    await aiDialog.getPromptTextArea().input.pressSequentially('request');
    await aiDialog.getGenerateButton().element.click();

    await testScreenshot(page, 'htmleditor-ai-dialog-ask-ai-result-ready-state.png', { element: '#container' });
  });

  test('result ready after canceletion', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', () => ({
      height: 600,
      width: 900,
      aiIntegration: {
        summarize() { return () => {}; },
      },
      toolbar: {
        items: ['ai'],
      },
    }));

    const htmlEditor = await openAIDialog(page, 0);

    await htmlEditor.aiDialog.getCancelButton().element.click();

    await testScreenshot(page, 'htmleditor-ai-dialog-result-ready-after-canceletion.png', { element: '#container' });
  });

  test('error state', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', () => ({
      height: 600,
      width: 900,
      aiIntegration: {
        summarize(_: unknown, { onError }: AICallbacks) { onError(); },
      },
      toolbar: {
        items: ['ai'],
      },
    }));

    await openAIDialog(page, 0);
    await testScreenshot(page, 'htmleditor-ai-dialog-error-state.png', { element: '#container' });
  });

  test.describe('small screen', () => {
    test.use({ browserSize: [400, 700] });

    ['initial', 'generating', 'result-ready', 'error'].forEach((state) => {
      test(`${state} state on small screen`, async ({ page }) => {
        await insertStylesheetRulesToPage(page, `
          .${LOADINDICATOR_SEGMENT_CLASS},
          .${LOADINDICATOR_CONTENT_CLASS},
          .${LOADINDICATOR_ICON_CLASS},
          .${LOADINDICATOR_SEGMENT_INNER_CLASS} {
            animation: none !important;
            opacity: 1 !important;
          }
        `);

        await createWidget(page, 'dxHtmlEditor', ({ aiState, aiResult }) => {
          const configurations = {
            initial: {},
            generating: {
              summarize() {},
            },
            'result-ready': {
              result: aiResult,
              summarize(_: unknown, { onComplete }: AICallbacks) { onComplete(this.result); },
            },
            error: {
              summarize(_: unknown, { onError }: AICallbacks) { onError(); },
            },
          };

          return {
            height: 700,
            aiIntegration: { ...configurations[aiState as keyof typeof configurations] },
            toolbar: {
              items: ['ai'],
            },
          };
        }, '#container', { arg: { aiState: state, aiResult: longResult } });

        await openAIDialog(page, 0);
        await testScreenshot(page, `htmleditor-ai-dialog-${state}-state-on-small-screen.png`, { element: '#container' });
      });
    });
  });
});
