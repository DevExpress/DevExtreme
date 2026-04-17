import { test } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe.skip('Export button', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('allowExportSelectedData: false, menu: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      export: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await testScreenshot(page, 'grid-export-one-button.png', { element: dataGrid.getHeaderPanel().element });
  });

  test('allowExportSelectedData: false, menu: false, PDF', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      export: {
        enabled: true,
        formats: ['pdf'],
      },
    });

    const dataGrid = new DataGrid(page);
    await testScreenshot(page, 'grid-export-one-button-pdf.png', { element: dataGrid.getHeaderPanel().element });
  });

  test('allowExportSelectedData: true, menu: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      height: 300,
      export: {
        enabled: true,
        allowExportSelectedData: true,
        formats: ['xlsx', 'pdf', 'csv'],
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getExportButton().click();

    await testScreenshot(page, 'grid-export-dropdown-button.png', { element: dataGrid.element });
  });

  test('allowExportSelectedData: false, menu: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      export: {
        enabled: true,
      },
      width: 30,
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getDropDownMenuButton().click();

    await testScreenshot(page, 'grid-export-one-button-in-menu.png', { element: page.locator('html') });
  });

  test('allowExportSelectedData: true, menu: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      export: {
        enabled: true,
        allowExportSelectedData: true,
        formats: ['xlsx', 'pdf'],
      },
      width: 30,
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getDropDownMenuButton().click();

    await testScreenshot(page, 'grid-export-dropdown-button-in-menu.png', { element: page.locator('html') });
  });

  test('Export is disabled when no data columns is in grid header, menu: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ value: 1 }],
      groupPanel: {
        visible: true,
      },
      columns: [
        { dataField: 'value', groupIndex: 0 },
      ],
      export: {
        enabled: true,
        allowExportSelectedData: true,
        formats: ['xlsx', 'pdf'],
      },
    });

    const dataGrid = new DataGrid(page);
    await testScreenshot(page, 'disabled-export_when-no-columns-visible.png', { element: dataGrid.element });
  });

  test('Export is disabled when no data columns is in grid header, menu: true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ value: 1 }],
      columns: [
        { dataField: 'value', visible: false },
      ],
      columnChooser: {
        enabled: true,
      },
      toolbar: {
        items: [
          { name: 'exportButton', locateInMenu: 'always' },
          { name: 'columnChooserButton', locateInMenu: 'always' },
        ],
      },
      export: {
        enabled: true,
        allowExportSelectedData: true,
        formats: ['xlsx', 'pdf'],
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.getHeaderPanel().getDropDownMenuButton().click();

    await testScreenshot(page, 'disabled-export-in-menu_when-no-columns-visible.png', { element: page.locator('html') });
  });
});
