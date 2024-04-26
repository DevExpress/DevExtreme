import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import url from '../../../helpers/getPageUrl';
import { isMaterialBased } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';

const testFixture = () => (isMaterialBased() ? fixture.skip : fixture);

testFixture().disablePageReloads`PivotGrid: running total`
  .page(url(__dirname, '../../container.html'));

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

test('Should correctly sum cells values with runningTotal', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  await takeScreenshot('running-total_seamless-data.png', pivotGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
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
    store: seamlessData,
  },
}));

test('Should correctly sum cells values with runningTotal with partial data (T1144885)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  await takeScreenshot('running-total_partial-data_render-0.png', pivotGrid.element);

  const rowToCollapse = pivotGrid.getRowsArea().getCell(3);
  await t.click(rowToCollapse);

  await takeScreenshot('running-total_partial-data_render-1.png', pivotGrid.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
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
    store: partialData,
  },
}));
