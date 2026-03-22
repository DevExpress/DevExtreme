import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container-extended.html')}`;

test.describe('HtmlEditor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const MENU_ITEM_CLASS = 'dx-menu-item';
  const SUBMENU_CLASS = 'dx-submenu';

  [false, true].forEach((toolbar) => {
    const selector = toolbar ? '#otherContainer' : '#container';
    const clickTarget = toolbar ? '#otherContainer .dx-bold-format' : '#container';
    const baseScreenName = toolbar ? 'htmleditor-with-toolbar' : 'htmleditor-without-toolbar';

    test(`T1025549 - ${baseScreenName}`, async ({ page }) => {

      await setStyleAttribute(page, '#container', 'box-sizing: border-box; height: 200px; width: 200px');
      await setStyleAttribute(page, '#otherContainer', 'box-sizing: border-box; height: 200px; width: 200px');
      await appendElementTo(page, '#container', 'div', 'editor');
      await appendElementTo(page, '#otherContainer', 'div', 'editorWithToolbar');

      await createWidget(page, 'dxHtmlEditor', {
        height: 200,
        width: '100%',
        value: Array(100).fill('string').join('\n'),
      }, '#editor');

      await createWidget(page, 'dxHtmlEditor', {
        height: 200,
        width: '100%',
        value: Array(100).fill('string').join('\n'),
        toolbar: {
          items: ['bold', 'color'],
        },
      }, '#editorWithToolbar');


      await testScreenshot(page, `${baseScreenName}.png`, { element: selector });

      await page.click(Selector(clickTarget));

      await testScreenshot(page, `${baseScreenName}-focused.png`, { element: selector });

    });
  });

  test('AI toolbar item', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 500,
      width: 350,
      aiIntegration: {},
      toolbar: {
        items: ['ai'],
      },
    });

    const htmlEditor = page.locator('#container');

    await testScreenshot(page, 'htmleditor-ai-toolbar-item.png', { element: '#container' });

    await page.click(htmlEditor.toolbar.getItemByName('ai'))
      .click(page.locator(`.${SUBMENU_CLASS}`).find(`.${MENU_ITEM_CLASS}`).nth(5));

    await testScreenshot(page, 'htmleditor-ai-toolbar-item-expanded.png', { element: '#container' });

    });
});
