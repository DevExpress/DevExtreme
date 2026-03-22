import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Splitter_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const getScreenshotName = (state: string) => `Splitter apearance - handle in ${state} state.png`;

  test('ResizeHandle appearance in inactive state, allowKeyboardNavigation', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
    width: 600,
    height: 300,
    dataSource: [{
      text: 'pane_1',
    }, {
      text: 'pane_2',
      resizable: false,
    }],
  });

    await testScreenshot(page, getScreenshotName('inactive'), { element: '#container' });

    });

  test('ResizeHandle appearance in different states, allowKeyboardNavigation', async ({ page }) => {
    await createWidget(page, 'dxSplitter', {
    width: 600,
    height: 300,
    dataSource: [{
      text: 'pane_1',
      collapsible: true,
    }, {
      text: 'pane_2',
      collapsible: true,
    }],
  });

    const splitter = page.locator('#container');

    await click(page.locator('body'), { offsetX: -50 });

    await testScreenshot(page, getScreenshotName('normal'), { element: '#container' });

    await hover(splitter.resizeHandles.nth(0));

    await testScreenshot(page, getScreenshotName('hover'), { element: '#container' });

    await page.dispatchEvent(splitter.resizeHandles.nth(0), 'mousedown')
      .wait(500);

    await testScreenshot(page, getScreenshotName('active'), { element: '#container' });

    await dispatchEvent(splitter.resizeHandles.nth(0), 'mouseup');

    await click(splitter.resizeHandles.nth(0));

    await testScreenshot(page, getScreenshotName('focused'), { element: '#container' });

    });

  ['horizontal', 'vertical'].forEach((orientation) => {
    test(`Splitter appearance, orientation='${orientation}'`, async ({ page }) => {

      await createWidget(page, 'dxSplitter', {
        orientation,
        width: 600,
        height: 300,
        dataSource: [{
          text: 'pane_1', collapsible: true,
        }, {
          text: 'pane_2', collapsible: true,
        },
        ],
      });


      await testScreenshot(page, `Splitter appearance, orientation='${orientation}'.png`, { element: '#container' });

    });

    test(`Nested Splitter appearance, orientation='${orientation}'`, async ({ page }) => {

      await createWidget(page, 'dxSplitter', {
        orientation,
        width: 600,
        height: 300,
        dataSource: [{ text: 'Pane_1', collapsible: true },
          {
            splitter: {
              orientation: orientation === 'horizontal' ? 'vertical' : 'horizontal',
              dataSource: [{
                text: 'Pane_2_1', collapsible: true,
              }, {
                text: 'Pane_2_2', collapsible: true,
              }, {
                text: 'Pane_2_3', collapsible: true,
              }],
            },
            collapsible: true,
          },
          { text: 'Pane_3', collapsible: true },
        ],
      });


      await testScreenshot(page, `Nested Splitter appearance, orientation='${orientation}'.png`, { element: '#container' });

    });
  });
});
