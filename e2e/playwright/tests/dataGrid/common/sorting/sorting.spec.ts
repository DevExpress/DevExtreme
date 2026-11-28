import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

test.describe('Sorting', () => {
  test('Filter expression should be valid when sortingMethod, remoteOperations, and autoNavigateToFocusedRow are specified (T1200546)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const sampleData = Array.from({ length: 20 }, (_, i) => ({ ID: i + 1, Name: `Name ${i + 1}` }));
      const sampleAPI = new (window as any).DevExpress.data.ArrayStore(sampleData);
      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        load(o) {
          if (o.filter && typeof o.filter[0] === 'function') {
            return Promise.reject();
          }
          return Promise.all([sampleAPI.load(o), sampleAPI.totalCount(o)]).then((res) => ({
            data: res[0],
            totalCount: res[1],
          }));
        },
      });
      return {
        dataSource: store,
        remoteOperations: true,
        columns: ['ID', {
          dataField: 'Name',
          sortOrder: 'asc',
          sortingMethod() {
            return 1;
          },
        }],
        paging: { pageSize: 5 },
        scrolling: { mode: 'virtual' },
        height: 200,
        showBorders: true,
        focusedRowEnabled: true,
        focusedRowKey: 18,
        autoNavigateToFocusedRow: true,
      };
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    // assert
    await expect(dataGrid.getDataRows()).toHaveCount(6);
    await expect(dataGrid.getErrorRow()).not.toBeAttached();
  });

  test('Multiple sorting alphabetical icons should be correct (T1243658)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          ID: 1,
          FirstName: 'John',
        },
      ],
      keyExpr: 'ID',
      sorting: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'FirstName',
          sortOrder: 'asc',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getHeaders().element.click({ button: 'right', position: { x: 10, y: 10 } });

    await testScreenshot(page, 'datagrid-alphabetical-icons-should-be-correct.png');
  });

  test('Sorting and filtering should be applied correctly when they change at runtime (T1237863)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          ID: 1,
          FirstName: 'Bob',
          room: 1,
        },
        {
          ID: 2,
          FirstName: 'Alex',
          room: 2,
        },
        {
          ID: 3,
          FirstName: 'John',
          room: 1,
        },
      ],
      keyExpr: 'ID',
      sorting: {
        mode: 'multiple',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.option({
      'columns[1].sortIndex': 0,
      'columns[1].sortOrder': 'desc',
      filterValue: ['room', '=', '1'],
    });

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1237863_datagrid-sorting_and_filtering.png', { element: dataGrid.element });
  });
});
