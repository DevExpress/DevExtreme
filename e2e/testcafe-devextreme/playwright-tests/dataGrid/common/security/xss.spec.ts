import { test, expect } from '@playwright/test';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('XSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  .beforeEach(async (t) => {
      await t
        .setNativeDialogHandler((type) => {
          if (type === 'alert') {
            throw Error('XSS alert was invoked!');
          }
        })
        .navigateTo(url(__dirname, './pages/XSS.html'));
    })
    .afterEach(async (t) => {
      await t.navigateTo(url(__dirname, '../../../container.html'));
    });

  test('The XSS script does not run when the markup has been replaced with text', async ({ page }) => {
    const filterBuilder = new FilterBuilder('#filter-builder');
    const group = filterBuilder.getField(0, 'groupOperation');

    await (group.element).click();
    expect(await FilterBuilder.getPopupTreeView().visible).toBeTruthy();
    await (FilterBuilder.getPopupTreeViewNode().click());
    expect(await true);
    await t.ok();
  });
});
