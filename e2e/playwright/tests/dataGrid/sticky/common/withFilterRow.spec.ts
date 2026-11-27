import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { defaultConfig } from '../helpers/data';

test.describe('Sticky columns - Filter row', () => {
  test.use({ browserSize: [800, 800] });

  test('Filter row with sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      filterRow: {
        visible: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getHeaders().getFilterRow().getFilterCell(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await filterCell.element.click();
    await expect(filterCell.getEditorInput().element).toBeFocused();

    await testScreenshot(page, 'filter_row_with_sticky_columns_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'filter_row_with_sticky_columns_2.png', { element: dataGrid.element });
  });

  test('Filter row with sticky columns when there are band columns and showColumnHeaders = false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (config) => ({
      ...config,
      customizeColumns(columns) {
        columns.push({
          caption: 'Band column',
          columns: ['CustomerStoreCity', 'CustomerStoreState'],
        });
      },
    }), DEFAULT_SELECTOR, {
      arg: {
        ...defaultConfig,
        filterRow: {
          visible: true,
        },
        showColumnHeaders: false,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const filterCell = dataGrid.getHeaders().getFilterRow().getFilterCell(1);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await filterCell.element.click();
    await expect(filterCell.getEditorInput().element).toBeFocused();

    await testScreenshot(page, 'filter_row_with_sticky_and_band_columns_1_(showColumnHeaders_=_false).png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'filter_row_with_sticky_and_band_columns_2_(showColumnHeaders_=_false).png', { element: dataGrid.element });
  });
});
