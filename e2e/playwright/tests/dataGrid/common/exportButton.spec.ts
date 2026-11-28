import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';

test.describe('Export button', () => {
  test('allowExportSelectedData: false, menu: false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 2 }],
      export: {
        enabled: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await headerPanel.getExportButton().element.click();

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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await headerPanel.getDropDownMenuButton().click();

    await testScreenshot(page, 'grid-export-one-button-in-menu.png', { element: 'html', withOverflow: true });
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await headerPanel.getDropDownMenuButton().click();

    await testScreenshot(page, 'grid-export-dropdown-button-in-menu.png', { element: 'html', withOverflow: true });
  });

  test.describe(() => {
    test.use({ browserSize: [800, 800] });

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

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      await expect.poll(() => dataGrid.isReady()).toBe(true);

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

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const headerPanel = dataGrid.getHeaderPanel();

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await headerPanel.getDropDownMenuButton().click();

      await testScreenshot(page, 'disabled-export-in-menu_when-no-columns-visible.png', { element: 'html', withOverflow: true });
    });
  });
});
