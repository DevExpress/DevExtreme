import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Focus', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  const GRID_SELECTOR = '#container';
  const FOCUSED_CLASS = 'dx-focused';

  test.skip('Should remove dx-focused class on blur event from the cell', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (firstCell.element, locator.element(), hasClass)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { A: 0, B: 1, C: 2 },
        { A: 3, B: 4, C: 5 },
        { A: 6, B: 7, C: 8 },
      ],
      editing: {
        mode: 'batch',
        allowUpdating: true,
        startEditAction: 'dblClick',
      },
      onCellClick: (event) => event.component.focus(event.cellElement),
    });

      const firstCell = page.locator('.dx-data-row').nth(0).locator('td').nth(1);
    const secondCell = page.locator('.dx-data-row').nth(1).locator('td').nth(1);

    await (firstCell.element).click();
    await (secondCell.element).click();

    expect(await firstCell.element().hasClass(FOCUSED_CLASS)).toBeFalsy();
    expect(await secondCell.element().hasClass(FOCUSED_CLASS)).toBeTruthy();
  });
    // TODO: .after() block removed
});
