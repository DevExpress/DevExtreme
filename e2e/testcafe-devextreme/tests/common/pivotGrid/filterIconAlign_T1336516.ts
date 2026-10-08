import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { Themes } from '../../../helpers/themes';

fixture.disablePageReloads`PivotGrid_filterIcon`
  .page(url(__dirname, '../../container.html'));

test.meta({ themes: [Themes.genericLight] })('Filter icon aligns with the field caption (T1336516)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const pivotGrid = new PivotGrid('#container');
  const headerFilterIcon = pivotGrid.getColumnHeaderArea().getHeaderFilterIcon();

  await t.expect(headerFilterIcon.element.exists).ok();

  await testScreenshot(t, takeScreenshot, 'PivotGrid filter icon align T1336516.png', {
    element: pivotGrid.getColumnHeaderArea().element,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
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
}));
