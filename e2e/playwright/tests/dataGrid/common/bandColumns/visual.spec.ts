import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const dataSource = [
  {
    id: 0,
    A: 'A_0',
    B: 0,
  },
  {
    id: 1,
    A: 'A_1',
    B: 1,
  },
  {
    id: 2,
    A: 'A_2',
    B: 2,
  },
];

const lookUpDataSource = [
  {
    id: 0,
    text: 'Lookup_value_0',
  },
  {
    id: 1,
    text: 'Lookup_value_1',
  },
  {
    id: 2,
    text: 'Lookup_value_2',
  },
];

const columns = [
  {
    dataField: 'A',
  },
  {
    dataField: 'B',
    lookup: {
      dataSource: lookUpDataSource,
      valueExpr: 'id',
      displayExpr: 'text',
    },
  },
];

const nestedColumns = [
  {
    dataField: 'A',
  },
  {
    name: 'Nested',
    caption: 'Nested',
    columns: [
      {
        dataField: 'B',
        lookup: {
          dataSource: lookUpDataSource,
          valueExpr: 'id',
          displayExpr: 'text',
        },
      },
    ],
  },
];

const changeDataGridColumnsReactWay = (page: Page): Promise<void> => page.evaluate(
  ({ gridSelector, nested }) => {
    const dataGridWidget = ($(gridSelector) as any).dxDataGrid('instance');

    dataGridWidget.beginUpdate();

    dataGridWidget.option('columns[1].dataField', undefined);
    dataGridWidget.option('columns[1].lookup', undefined);
    dataGridWidget.option('columns[1].columns', nested[1].columns);
    dataGridWidget.option('columns[1].name', nested[1].name);
    dataGridWidget.option('columns[1].caption', nested[1].caption);

    dataGridWidget.endUpdate();
  },
  { gridSelector: DEFAULT_SELECTOR, nested: nestedColumns },
);

test.describe('Band columns.Visual', () => {
  test('Should change usual columns to band columns without error in React (T1213679)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [...dataSource],
      columns: [...columns],
      keyExpr: 'id',
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'band-columns_before-runtime-update.png', { element: dataGrid.element });

    await changeDataGridColumnsReactWay(page);

    await testScreenshot(page, 'band-columns_after-runtime-update.png', { element: dataGrid.element });
  });
});
