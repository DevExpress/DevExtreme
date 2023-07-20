import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import { testScreenshot } from '../../helpers/themeUtils';
import PivotGrid from '../../model/pivotGrid';
import { sales } from './data';

fixture.disablePageReloads`pivotGrid_headerFilter`
  .page(url(__dirname, '../container.html'));

test('Header filter popup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getColumnHeaderArea().getHeaderFilterIcon());

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
