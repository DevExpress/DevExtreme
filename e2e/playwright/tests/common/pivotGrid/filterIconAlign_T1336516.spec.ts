import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import PivotGrid from '../../../models/pivotGrid';

test('Filter icon aligns with the field caption (T1336516)', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    width: 1000,
    allowFiltering: true,
    allowSorting: false,
    showBorders: true,
    fieldChooser: {
      enabled: false,
    },
    fieldPanel: {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: false,
      showRowFields: true,
      allowFieldDragging: false,
      visible: true,
    },
    dataSource: {
      fields: [{
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        groupName: 'date',
        groupInterval: 'year',
        expanded: true,
      }, {
        groupName: 'date',
        groupInterval: 'quarter',
        expanded: true,
      }, {
        groupName: 'date',
        groupInterval: 'month',
      }, {
        caption: 'Region',
        dataField: 'region',
        area: 'row',
      }, {
        caption: 'Sales',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data',
      }],
      store: [{
        region: 'Africa',
        amount: 500,
        date: '2015-05-26',
      }, {
        region: 'South America',
        amount: 780,
        date: '2015-05-07',
      }],
    },
  });

  const pivotGrid = new PivotGrid(page, '#container');
  const columnHeader = pivotGrid.getColumnHeaderArea();

  await expect(columnHeader.getHeaderFilterIcon().element).toBeVisible();

  await testScreenshot(page, 'PivotGrid filter icon align T1336516.png', {
    element: columnHeader.element,
  });
});
