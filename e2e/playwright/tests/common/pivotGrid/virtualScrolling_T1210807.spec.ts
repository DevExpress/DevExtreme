import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import PivotGrid from '../../../models/pivotGrid';

const createData = (count: number, innerCount: number): object[] => {
  const result: object[] = [];

  for (let i = 0; i < count; i += 1) {
    for (let j = 0; j < innerCount; j += 1) {
      result.push({
        item: `item ${i}`,
        date: new Date('2024-01-01'),
        category: `category ${j}`,
        innerA: j,
        innerB: j,
      });
    }
  }

  return result;
};

test('Row fields overlap data fields if dataFieldArea is set to "row" and virtual scrolling is enabled (T1210807)', {
  tag: ['@material.blue.light', '@generic.light'],
}, async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    allowExpandAll: true,
    showBorders: true,
    rowHeaderLayout: 'tree',
    dataFieldArea: 'row',
    height: 560,
    scrolling: {
      mode: 'virtual',
    },
    dataSource: {
      fields: [
        {
          dataField: 'item',
          area: 'row',
          width: 120,
        },
        {
          dataField: 'category',
          area: 'row',
          width: 120,
        },
        {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
          groupInterval: 'year',
        },
        {
          dataField: 'innerA',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
        },
        {
          dataField: 'innerB',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data',
        },
      ],
      store: createData(50, 5),
    },
  });

  const pivotGrid = new PivotGrid(page, '#container');
  const firstHeaderRow = pivotGrid.getRowsArea(2).getCell(0);

  await firstHeaderRow.click();
  await pivotGrid.scrollBy({ top: 30000 });

  await testScreenshot(page, 'rows_do_not_overlap_data_fields_if_virtual_scrolling_enabled_T1210807.png', { element: pivotGrid.element });
});
