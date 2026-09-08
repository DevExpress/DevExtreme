import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';

const PIVOT_GRID_SELECTOR = '#container';

const seamlessData = [
  {
    month: 'A',
    value: 1,
    first_row: '0_0',
    second_row: '0_1',
  },
  {
    month: 'B',
    value: 1,
    first_row: '0_0',
    second_row: '0_1',
  },
  {
    month: 'C',
    value: 1,
    first_row: '0_0',
    second_row: '0_1',
  },
  {
    month: 'A',
    value: 2,
    first_row: '1_0',
    second_row: '1_1',
  },
  {
    month: 'B',
    value: 2,
    first_row: '1_0',
    second_row: '1_1',
  },
  {
    month: 'C',
    value: 2,
    first_row: '1_0',
    second_row: '1_1',
  },
];

const partialData = [
  {
    month: 'A',
    value: 1,
    first_row: '0_0',
    second_row: '0_1',
  },
  {
    month: 'B',
    value: 2,
    first_row: '1_0',
    second_row: '1_1',
  },
  {
    month: 'C',
    value: 3,
    first_row: '2_0',
    second_row: '2_1',
  },
];

const createConfig = (store: unknown): unknown => ({
  dataSource: {
    fields: [
      {
        dataField: 'first_row',
        area: 'row',
        expanded: true,
      },
      {
        dataField: 'second_row',
        area: 'row',
      },
      {
        dataField: 'value',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
        runningTotal: 'row',
      },
      {
        dataField: 'month',
        area: 'column',
      },
    ],
    store,
  },
});

test('Should correctly sum cells values with runningTotal', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig(seamlessData));

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await testScreenshot(page, 'running-total_seamless-data.png', { element: pivotGrid.element });
});

test('Should correctly sum cells values with runningTotal with partial data (T1144885)', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig(partialData));

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await testScreenshot(page, 'running-total_partial-data_render-0.png', { element: pivotGrid.element });

  const rowToCollapse = pivotGrid.getRowsArea().getCell(3);

  await rowToCollapse.click();

  await testScreenshot(page, 'running-total_partial-data_render-1.png', { element: pivotGrid.element });
});
