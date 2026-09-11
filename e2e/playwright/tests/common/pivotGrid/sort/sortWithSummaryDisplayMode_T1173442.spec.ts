import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';

test('Should apply sort changes to the markup if the "summaryDisplayMode" is set', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
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
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await testScreenshot(
    page,
    'T1173442_before_sort_with_summary_display_mode.png',
    { element: pivotGrid.element },
  );

  await pivotGrid.getColumnHeaderArea().getField().click();
  await pivotGrid.getRowHeaderArea().getField().click();

  await testScreenshot(
    page,
    'T1173442_after_sort_with_summary_display_mode.png',
    { element: pivotGrid.element },
  );
});
