import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import HeaderFilter from 'devextreme-testcafe-models/dataGrid/headers/headerFilter';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { testScreenshot } from '../../helpers/themeUtils';
import { sales } from './data';

fixture.disablePageReloads`pivotGrid_headerFilter`
  .page(url(__dirname, '../container.html'));

const PIVOT_GRID_SELECTOR = '#container';

test('Header filter popup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  await t.click(pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().element);

  await testScreenshot(t, takeScreenshot, 'headerFilter - before scroll.png');

  await t.scroll(pivotGrid.getColumnHeaderArea().getHeaderFilterScrollable(), 0, 10);

  await testScreenshot(t, takeScreenshot, 'headerFilter - after scroll.png');

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxPivotGrid', {
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
});

test('[T1284200] Should handle dxList "selectAll" when has unselected items on the second page', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);

  const filterIconElement = pivotGrid.getColumnHeaderArea().getHeaderFilterIcon().element;
  const headerFilter = new HeaderFilter();
  const list = headerFilter.getList();

  await t
    .click(filterIconElement)
    .click(list.selectAll.checkBox.element);

  await t.expect(list.selectAll.checkBox.isChecked).ok();

  await t.click(list.selectAll.checkBox.element);

  await t.expect(list.selectAll.checkBox.isChecked).notOk();
}).before(async () => createWidget('dxPivotGrid', {
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
}));
