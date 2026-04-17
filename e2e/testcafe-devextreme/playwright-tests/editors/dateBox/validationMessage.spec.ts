import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox ValidationMessagePosition', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 400 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('DateBox ValidationMessage position is correct', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 400 });

    const positions = ['top', 'right', 'bottom', 'left'];
    const ids: string[] = [];

    for (const position of positions) {
      const id = `db-${position}`;
      ids.push(id);

      await page.evaluate(({ parentSel, elId }) => {
        const div = document.createElement('div');
        div.id = elId;
        document.querySelector(parentSel)?.appendChild(div);
      }, { parentSel: '#container', elId: id });

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

    for (const id of ids) {
      await page.evaluate((sel) => {
        const instance = ($(sel) as any).dxDateBox('instance');
        instance.option('value', new Date(2022, 6, 14));
      }, `#${id}`);
    }

    await testScreenshot(page, 'Datebox validation message.png');
  });
});
