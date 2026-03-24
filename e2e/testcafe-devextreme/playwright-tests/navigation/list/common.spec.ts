import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, isMaterialBased, isFluent } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Should focus first item after changing selection mode (T811770)', async ({ page }) => {
    // skipped: requires List page object with focus, selectAll, getItem, radioButton
  });

  test.skip('There is hover class in hovered list item (T1110076)', async ({ page }) => {
    // skipped: requires List page object with getItem, repaint, dispatchEvent
  });

  test.skip('List selection should work with keyboard arrows (T718398)', async ({ page }) => {
    // skipped: requires List page object with focus, getItem, selectAll, checkBox
  });

  test.skip('Should save focused checkbox', async ({ page }) => {
    // skipped: requires List page object with focus, getItem, selectAll, checkBox
  });

  test.skip('Grouped list can not reorder items (T727360)', async ({ page }) => {
    // skipped: requires List page object with getGroup, dragToElement
  });

  test.skip('Grouped List with nested List should able to reorder items (T845082)', async ({ page }) => {
    // skipped: requires List page object with getGroup, drag, ClientFunction
  });

  test.skip('Disabled item should be focused on tab press to match accessibility criteria', async ({ page }) => {
    // skipped: requires List page object with searchInput, getItem, focus, option
  });

  test('The delete button should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: [{
        text: 'item 1',
        icon: 'user',
      }],
      allowItemDeleting: true,
      itemDeleteMode: 'static',
    });

    await page.evaluate(() => {
      ($('#container') as any).dxList('instance').focus();
    });

    await testScreenshot(page, 'List delete button when item is focused.png');
  });

  test('The button icon in custom template should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: [{ text: 'item 1' }],
      itemTemplate: (_: any, __: any, element: any) => {
        const button = ($('<div>') as any).dxButton({
          text: 'custom',
          icon: 'home',
        });

        element.append(button);
      },
    });

    await page.evaluate(() => {
      ($('#container') as any).dxList('instance').focus();
    });

    await testScreenshot(page, 'List icon in button when item is focused.png');
  });
});
