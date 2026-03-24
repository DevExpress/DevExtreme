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

      await page.locator(clickTarget).click();

      await testScreenshot(page, `${baseScreenName}-focused.png`, { element: selector });
    });
  });

  test.skip('AI toolbar item', async ({ page }) => {
    // skipped: requires HtmlEditor page object with toolbar.getItemByName
  });
});
