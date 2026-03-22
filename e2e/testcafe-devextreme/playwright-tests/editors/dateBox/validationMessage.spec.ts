import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox ValidationMessagePosition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const positions = ['top', 'right', 'bottom', 'left'];

  test('DateBox ValidationMessage position is correct', async ({ page }) => {

      for (const id of t.ctx.ids) {
      const dateBox = page.locator(`#${id}`);
      await dateBox.option('value', new Date(2022, 6, 14));
    }

    await testScreenshot(page, 'Datebox validation message.png');

    });.before(async ({ page }) => {
    t.ctx.ids = [];

      for (const position of positions) {
      const id = `${`dx${new Guid()}`}`;

      await appendElementTo(page, '#container', 'div', id, {});

      t.ctx.ids.push(id);
      await createWidget(page, 'dxDateBox', {
        elementAttr: { style: 'display: inline-block; margin: 50px 100px 0 0;' },
        width: 150,
        height: 40,
        validationMessageMode: 'always',
        validationMessagePosition: position,
      }, `#${id}`);

      await createWidget(page, 'dxValidator', {
        validationRules: [{
          type: 'range',
          max: new Date(1),
          message: 'out of range',
        }],
      }, `#${id}`);
    }
  });
});
