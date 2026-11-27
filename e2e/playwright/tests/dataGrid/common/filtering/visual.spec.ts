import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Filtering', () => {
  test('Data should be filtered if True is selected via the filter method when case sensitivity is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { ID: 1, text: 'true' },
          { ID: 2, text: 'True' },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: {
            sensitivity: 'case',
          },
        },
      },
      keyExpr: 'ID',
      showBorders: true,
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    // act
    await dataGrid.apiFilter(['text', '=', 'true']);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'filter-method-with-case-sensitive-1.png', { element: dataGrid.element });

    // act
    await dataGrid.apiFilter(['text', '=', 'True']);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'filter-method-with-case-sensitive-2.png', { element: dataGrid.element });
  });

  test('Data should be filtered if True is selected via the option method when case sensitivity is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { ID: 1, text: 'true' },
          { ID: 2, text: 'True' },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: {
            sensitivity: 'case',
          },
        },
      },
      keyExpr: 'ID',
      showBorders: true,
      columns: ['ID', {
        dataField: 'text',
        filterValue: 'true',
      }],
    });

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'filtering-via-option-method-with-case-sensitive-1.png', { element: dataGrid.element });

    // act
    await dataGrid.option('columns', ['ID', { dataField: 'text', filterValue: 'True' }]);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'filtering-via-option-method-with-case-sensitive-2.png', { element: dataGrid.element });
  });
});
