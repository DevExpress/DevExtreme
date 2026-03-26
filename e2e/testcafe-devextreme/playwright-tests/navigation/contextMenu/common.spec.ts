import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ContextMenu_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('ContextMenu items render', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'contextMenu');
    await setStyleAttribute(page, '#container', 'width: 300px; height: 200px;');

    await insertStylesheetRulesToPage(page, '.custom-class { box-shadow: 0 0 0 2px green !important; }');

    const menuItems: any[] = [
      { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
      { text: 'user', icon: 'user' },
      { text: 'coffee', icon: 'coffee' },
    ];

    await createWidget(page, 'dxContextMenu', {
      cssClass: 'custom-class',
      items: menuItems,
      target: 'body',
      position: {
        offset: '10 10',
      },
    }, '#contextMenu');

    await page.evaluate(() => {
      ($('#contextMenu') as any).dxContextMenu('instance').show();
    });

    await page.locator('.dx-context-menu .dx-menu-item').first().click();

    const screenshotName = 'ContextMenu items render.png';
    await testScreenshot(page, screenshotName, { element: '#container' });

    });

  test('ContextMenu selected focused item', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'contextMenu');
    await setStyleAttribute(page, '#container', 'width: 150px; height: 200px;');

    await insertStylesheetRulesToPage(page, '.custom-class { border: 2px solid green !important; }');

    const menuItems: any[] = [
      { text: 'remove', icon: 'remove', selected: true },
      { text: 'user', icon: 'user' },
      { text: 'coffee', icon: 'coffee' },
    ];

    await createWidget(page, 'dxContextMenu', {
      cssClass: 'custom-class',
      items: menuItems,
      target: 'body',
      position: {
        offset: '10 10',
      },
    }, '#contextMenu');

    await page.evaluate(() => {
      ($('#contextMenu') as any).dxContextMenu('instance').show();
    });

    await page.keyboard.press('ArrowDown');

    const screenshotName = 'ContextMenu selected focused item.png';
    await testScreenshot(page, screenshotName, { element: '#container' });

    });
});
