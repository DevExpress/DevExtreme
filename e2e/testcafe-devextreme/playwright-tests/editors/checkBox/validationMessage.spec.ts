import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CheckBox_ValidationMessage', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 300, height: 200 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form and has name "style" (T941581)', async ({ page }) => {

    await createWidget(page, 'dxCheckBox', {
      name: 'style',
    });

    await createWidget(page, 'dxValidator', {
      validationRules: [{
        type: 'required',
        message: 'it is required',
      }],
    });

    const checkBox = page.locator('#container');
    await checkBox.click();
    await checkBox.click();

    });

  test('ValidationMessage integrated in editor should not raise any errors when it is placed inside of form that has inline style with scale (T941581)', async ({ page }) => {

    await createWidget(page, 'dxCheckBox', {});

    await createWidget(page, 'dxValidator', {
      validationRules: [{
        type: 'required',
        message: 'it is required',
      }],
    });

    const checkBox1 = page.locator('#container');
    await checkBox1.click();
    await checkBox1.click();

    });

  const positions = ['top', 'right', 'bottom', 'left'];
  positions.forEach((position) => {
    test(`CheckBox ValidationMessage position is correct (${position})`, async ({ page }) => {

      await page.setViewportSize({ width: 300, height: 200 });

      await createWidget(page, 'dxCheckBox', {
        text: 'Click me!',
        elementAttr: { style: 'margin: 50px 0 0 100px;' },
        validationMessagePosition: position,
      });

      await createWidget(page, 'dxValidator', {
        validationRules: [{
          type: 'required',
          message: 'it is required',
        }],
      });


      const checkBox1 = page.locator('#container');
      await checkBox1.click();
      await checkBox1.click();

      await testScreenshot(page, `Checkbox validation message with ${position} position.png`, { maxDiffPixelRatio: 0.15 });

    });
  });
});
