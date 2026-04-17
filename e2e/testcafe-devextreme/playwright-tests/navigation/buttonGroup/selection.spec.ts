import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ButtonGroup_Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('selected class should not be added to the button after hovering (T1222079)', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', {
      items: [
        { text: 'Button_1' },
        { text: 'Button_2' },
      ],
      selectedItemKeys: ['Button_1'],
      disabled: true,
    });

    await page.evaluate(() => {
      ($('#container') as any).dxButtonGroup('instance').option('disabled', false);
    });

    const items = page.locator('#container .dx-buttongroup-item');

    await items.nth(1).click();
    expect(await items.nth(1).evaluate((el) => el.classList.contains('dx-item-selected'))).toBe(true);

    await items.nth(0).hover();
    expect(await items.nth(0).evaluate((el) => el.classList.contains('dx-item-selected'))).toBe(false);
  });

  test('selected class should be set after reenabling (T1308601)', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', {
      items: [
        { text: 'Button_1' },
        { text: 'Button_2' },
      ],
      selectedItemKeys: ['Button_1'],
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxButtonGroup('instance');
      instance.option('disabled', true);
      instance.option('disabled', false);
    });

    const items = page.locator('#container .dx-buttongroup-item');

    await items.nth(1).click();

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxButtonGroup('instance');
      instance.option('disabled', true);
      instance.option('disabled', false);
    });

    await items.nth(0).click();

    expect(await items.nth(0).evaluate((el) => el.classList.contains('dx-item-selected'))).toBe(true);

    await items.nth(1).hover();

    expect(await items.nth(0).evaluate((el) => el.classList.contains('dx-item-selected'))).toBe(true);
  });
});
