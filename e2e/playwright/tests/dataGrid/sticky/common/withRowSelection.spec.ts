import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { defaultConfig } from '../helpers/data';

test.describe('Sticky columns - Row Selection', () => {
  test.use({ browserSize: [800, 800] });

  test('The selected row should be displayed correctly when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      selection: {
        mode: 'multiple',
      },
      selectedRowKeys: [4],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'row_selection_with_sticky_columns_1.png', { element: dataGrid.element });

    await dataGrid.scrollTo({ left: 10000 });

    await testScreenshot(page, 'row_selection_with_sticky_columns_2.png', { element: dataGrid.element });
  });
});
