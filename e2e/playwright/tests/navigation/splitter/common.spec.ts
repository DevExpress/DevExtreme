import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import Splitter from '../../../models/splitter';

const getScreenshotName = (state: string): string => `Splitter apearance - handle in ${state} state.png`;

test.describe('Splitter_common', () => {
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

    const splitter = new Splitter(page, '#container');
    const resizeHandle = splitter.getResizeHandle(0);
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();

    await body.click({ position: { x: bodyBox!.width - 50, y: bodyBox!.height / 2 } });

    await testScreenshot(page, getScreenshotName('normal'), { element: '#container' });

    await resizeHandle.element.hover();

    await testScreenshot(page, getScreenshotName('hover'), { element: '#container' });

    await resizeHandle.element.dispatchEvent('mousedown');
    await resizeHandle.expectActive();

    await testScreenshot(page, getScreenshotName('active'), { element: '#container' });

    await resizeHandle.element.dispatchEvent('mouseup');

    await resizeHandle.element.click();

    await testScreenshot(page, getScreenshotName('focused'), { element: '#container' });
  });

  (['horizontal', 'vertical'] as const).forEach((orientation) => {
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
