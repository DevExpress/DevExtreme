import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { defaultConfig } from '../helpers/data';

test.describe('FixedColumns - MasterDetail', () => {
  test.use({ browserSize: [900, 800] });

  test('Sticky columns with master-detail', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      masterDetail: {
        enabled: true,
        template(container) {
          $(container)
            .text('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
        },
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandRow(1);
    await expect(dataGrid.getMasterRow(0).element).toBeVisible();

    await testScreenshot(page, 'masterdetail-scroll-begin.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 100 });

    await testScreenshot(page, 'masterdetail-scroll-center.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'masterdetail-scroll-end.png', { element: dataGrid.element });
  });

  test('Master detail resizing', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      masterDetail: {
        enabled: true,
        template(container) {
          $(container)
            .text('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
        },
      },
    }), DEFAULT_SELECTOR, { arg: defaultConfig });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiExpandRow(1);
    await expect(dataGrid.getMasterRow(0).element).toBeVisible();

    await testScreenshot(page, 'masterdetail-before-resize.png', { element: dataGrid.element });

    await dataGrid.apiOption('width', 500);

    await testScreenshot(page, 'masterdetail-after-resize.png', { element: dataGrid.element });
  });
});
