import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('DataGrid - contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // T1257970
  // visual: generic.light
  // visual: fluent.blue.light
  // visual: material.blue.light

  test('DataGrid - Contrast between icons in the Filter Row menu and their background doesn\'t comply with WCAG accessibility standards', async ({ page }) => {
      const filterCell = page.locator('.dx-datagrid-filter-row td').nth(0);
    const searchButton = filterCell.menuButton;
    const filterMenu = filterCell.menu;
    expect(await page.locator('.dx-datagrid').first().isVisible());
    await t.ok();
    await (searchButton).click();
    expect(await filterMenu.element.exists);
    await t.ok();

    await testScreenshot(page, 'T1257970-datagrid-menu-icon-contrast.png', { element: page.locator('#container') });
  }).before(
    async () => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(5, 5),
        filterRow: {
          visible: true,
        },
      });
    },
  );

  // T1286345
  // visual: generic.light
  // visual: fluent.blue.light
  // visual: material.blue.light
  test('DataGrid - Filter icon should remain visible when it\'s focused', async ({ page }) => {
      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    const searchIconContainer = dataGrid
      .getHeaders()
      .getFilterRow()
      .getFilterCell(1)
      .getSearchIcon()
      .element;

    await (page.locator('.dx-datagrid-filter-row td').nth(0).element).click();
    await page.keyboard.press('tab');
    expect(await searchIconContainer.focused);
    await t.ok();

    await testScreenshot(page, 'T1286345-datagrid-menu-icon-when-focused.png', { element: page.locator('#container') });
  );
  }).before(
    async () => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(2, 2),
        filterRow: {
          visible: true,
        },
      });
    },
});
