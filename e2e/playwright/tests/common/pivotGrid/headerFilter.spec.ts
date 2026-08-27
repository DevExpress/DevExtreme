import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import PivotGrid from '../../../models/pivotGrid';
import HeaderFilter from '../../../models/dataGrid/headers/headerFilter';
import { sales } from './data';

const PIVOT_GRID_SELECTOR = '#container';

test('Header filter popup', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    allowSorting: true,
    allowFiltering: true,
    fieldPanel: {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true,
      allowFieldDragging: true,
      visible: true,
    },
    headerFilter: {
      allowSearch: true,
    },
    dataSource: {
      fields: [{
        dataField: 'region',
        area: 'column',
      }, {
        dataField: 'date',
        area: 'row',
      }, {
        dataField: 'amount',
        area: 'data',
      }],
      store: sales,
    },
  });

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().element.click();

  await testScreenshot(page, 'headerFilter - before scroll.png');

  const scrollable = pivotGrid.getColumnHeaderArea().getHeaderFilterScrollable();

  await scrollable.evaluate((element) => { element.scrollTo(0, 10); });

  await testScreenshot(page, 'headerFilter - after scroll.png');
});

test('[T1284200] Should handle dxList "selectAll" when has unselected items on the second page', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    dataSource: {
      fields: [
        {
          dataField: 'id',
          area: 'column',
          filterType: 'exclude',
          filterValues: [70],
        },
      ],
      store: new Array(100).fill(null).map((_, idx) => ({
        id: idx,
      })),
    },
    allowSorting: true,
    allowFiltering: true,
    fieldPanel: {
      visible: true,
    },
  });

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const filterIconElement = pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().element;
  const headerFilter = new HeaderFilter(page);
  const list = headerFilter.getList();

  await filterIconElement.click();
  await list.selectAll.checkBox.element.click();

  expect(await list.selectAll.checkBox.isChecked()).toBe(true);

  await list.selectAll.checkBox.element.click();

  expect(await list.selectAll.checkBox.isChecked()).toBe(false);
});
