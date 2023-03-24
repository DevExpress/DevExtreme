import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { testScreenshot } from '../../helpers/themeUtils';
import PivotGrid from '../../model/pivotGrid';
import { sales } from './data';

fixture.disablePageReloads`pivotGrid_headerFilter`
  .page(url(__dirname, '../container.html'));

test.only('Header filter popup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getColumnHeaderArea().getHeaderFilterIcon());

  await testScreenshot(t, takeScreenshot, 'headerFilter - before scroll.png', {
    element: pivotGrid.getColumnHeaderArea().getHeaderFilterMenu(),
  });

  await t.scroll(pivotGrid.getColumnHeaderArea().getHeaderFilterScrollable(), 0, 20);

  await testScreenshot(t, takeScreenshot, 'headerFilter - after scroll.png', {
    element: pivotGrid.getColumnHeaderArea().getHeaderFilterMenu(),
  });

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
