import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';

fixture.disablePageReloads`pivotGrid_sort`
  .page(url(__dirname, '../../container.html'));

test('Should apply sort changes to the markup if the "summaryDisplayMode" is set', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid('#container');

  await testScreenshot(
    t,
    takeScreenshot,
    'T1173442_before_sort_with_summary_display_mode.png',
    { element: pivotGrid.element },
  );
  await t.click(pivotGrid.getColumnHeaderArea().getAction());
  await t.click(pivotGrid.getRowHeaderArea().getAction());
  await testScreenshot(
    t,
    takeScreenshot,
    'T1173442_after_sort_with_summary_display_mode.png',
    { element: pivotGrid.element },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
  allowSortingBySummary: true,
  allowSorting: true,
  fieldPanel: {
    showFilterFields: false,
    visible: true,
  },
  dataSource: {
    fields: [{
      dataField: 'row',
      area: 'row',
    }, {
      dataField: 'column',
      area: 'column',
    }, {
      dataField: 'value',
      dataType: 'number',
      summaryType: 'sum',
      area: 'data',
      summaryDisplayMode: 'percentVariation',
    }],
    store: [
      {
        row: 'row_A',
        column: 'column_A',
        value: 100,
      },
      {
        row: 'row_A',
        column: 'column_A',
        value: 100,
      },
      {
        row: 'row_A',
        column: 'column_B',
        value: 150,
      },
      {
        row: 'row_A',
        column: 'column_B',
        value: 150,
      },
      {
        row: 'row_A',
        column: 'column_C',
        value: 200,
      },
      {
        row: 'row_A',
        column: 'column_C',
        value: 200,
      },
      {
        row: 'row_B',
        column: 'column_A',
        value: 100,
      },
      {
        row: 'row_B',
        column: 'column_A',
        value: 100,
      },
      {
        row: 'row_B',
        column: 'column_B',
        value: 150,
      },
      {
        row: 'row_B',
        column: 'column_B',
        date: '2022-01-02',
        value: 150,
      },
      {
        row: 'row_B',
        column: 'column_C',
        value: 200,
      },
      {
        row: 'row_B',
        column: 'column_C',
        date: '2022-01-02',
        value: 200,
      },
    ],
  },
}));
