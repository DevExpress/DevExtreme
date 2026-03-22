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

    const buttonGroup = page.locator('#container');

    await buttonGroup.option('disabled', false);

    await buttonGroup.getItem(1).element.click();

    await page.expect(buttonGroup.getItem(1).isSelected)
      .ok()
      .expect(buttonGroup.isItemSelected(1))
      .ok();

    await page.hover(buttonGroup.getItem(0).element);

    await page.expect(buttonGroup.getItem(0).isSelected)
      .notOk()
      .expect(buttonGroup.isItemSelected(0))
      .notOk();

    });
  test('selected class should be set after reenabling (T1308601)', async ({ page }) => {
    await createWidget(page, 'dxButtonGroup', {
    items: [
      { text: 'Button_1' },
      { text: 'Button_2' },
    ],
    selectedItemKeys: ['Button_1'],
  });

    const buttonGroup = page.locator('#container');

    await buttonGroup.option('disabled', true);
    await buttonGroup.option('disabled', false);

    await buttonGroup.getItem(1).element.click();

    await buttonGroup.option('disabled', true);
    await buttonGroup.option('disabled', false);

    await buttonGroup.getItem(0).element.click();

    await page.expect(buttonGroup.getItem(0).isSelected)
      .ok()
      .expect(buttonGroup.isItemSelected(0))
      .ok();

    await page.hover(buttonGroup.getItem(1).element);

    await page.expect(buttonGroup.getItem(0).isSelected)
      .ok()
      .expect(buttonGroup.isItemSelected(0))
      .ok();

    });
});
