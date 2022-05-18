import { Selector } from 'testcafe';
import { createScreenshotsComparer } from '../../../helpers/screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { sales } from './data.js';

fixture`PivotGrid_fieldChooser`
  .page(url(__dirname, '../../container.html'));

// T1079461
test('Change dataFiels order with one invisible field', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(Selector('.dx-pivotgrid-field-chooser-button'));

  await t.click(Selector('.dx-popup-content .dx-treeview-node .dx-checkbox').nth(0));
  await t.click(Selector('.dx-popup-content .dx-treeview-node .dx-checkbox').nth(1));

  await t.drag(Selector('.dx-area').nth(4).find('.dx-area-fields .dx-area-field').nth(0), 0, 170);

  await t
    .expect(await takeScreenshot('Change_dataField_order_with_invisible_fields.png', '.dx-overlay-content.dx-popup-draggable'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
  allowSortingBySummary: true,
  allowFiltering: true,
  showBorders: true,
  showColumnGrandTotals: false,
  showRowGrandTotals: false,
  showRowTotals: false,
  showColumnTotals: false,
  fieldChooser: {
    enabled: true,
    height: 800,
  },
  dataSource: {
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
      sortBySummaryField: 'Total',
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'month',
      visible: false,
    }, {
      caption: 'Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 0,
    }, {
      caption: 'Total Hidden',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total 2',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 1,
    }, {
      caption: 'Total 3',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 2,
    }, {
      caption: 'Total 4',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      visible: true,
      isMeasure: true,
    }, {
      caption: 'Total 5',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      visible: true,
      isMeasure: true,
    }],
    store: sales,
  },
}));

test('Change dataFiels order with two invisible fields', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(Selector('.dx-pivotgrid-field-chooser-button'));

  await t.click(Selector('.dx-popup-content .dx-treeview-node .dx-checkbox').nth(0));
  await t.click(Selector('.dx-popup-content .dx-treeview-node .dx-checkbox').nth(1));

  await t.drag(Selector('.dx-area').nth(4).find('.dx-area-fields .dx-area-field').nth(0), 0, 170);

  await t
    .expect(await takeScreenshot('Change_dataField_order_with_invisible_fields.png', '.dx-overlay-content.dx-popup-draggable'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
  allowSortingBySummary: true,
  allowFiltering: true,
  showBorders: true,
  showColumnGrandTotals: false,
  showRowGrandTotals: false,
  showRowTotals: false,
  showColumnTotals: false,
  fieldChooser: {
    enabled: true,
    height: 800,
  },
  dataSource: {
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
      sortBySummaryField: 'Total',
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'month',
      visible: false,
    }, {
      caption: 'Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 0,
    }, {
      caption: 'Total Hidden',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total 2',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 1,
    }, {
      caption: 'Total Hidden',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total 3',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 2,
    }, {
      caption: 'Total 4',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      visible: true,
      isMeasure: true,
    }, {
      caption: 'Total 5',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      visible: true,
      isMeasure: true,
    }],
    store: sales,
  },
}));

// T1079461
test('Change dataFiels order with three invisible fields', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.click(Selector('.dx-pivotgrid-field-chooser-button'));

  await t.click(Selector('.dx-popup-content .dx-treeview-node .dx-checkbox').nth(0));

  await t.drag(Selector('.dx-area').nth(4).find('.dx-area-fields .dx-area-field').nth(0), 0, 170);

  await t
    .expect(await takeScreenshot('Change_dataField_order_with_three_invisible_fields.png', '.dx-overlay-content.dx-popup-draggable'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxPivotGrid', {
  allowSortingBySummary: true,
  allowFiltering: true,
  showBorders: true,
  showColumnGrandTotals: false,
  showRowGrandTotals: false,
  showRowTotals: false,
  showColumnTotals: false,
  fieldChooser: {
    enabled: true,
    height: 800,
  },
  onInitialized(e) {
    function expand(dataSource) {
      setTimeout(() => {
        dataSource.expandHeaderItem('row', ['North America']);
        dataSource.expandHeaderItem('column', [2013]);
      }, 0);
    }

    expand(e.component.getDataSource());
  },
  dataSource: {
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
      sortBySummaryField: 'Total',
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'month',
      visible: false,
    }, {
      caption: 'Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 0,
    }, {
      caption: 'Total 2',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 1,
    }, {
      caption: 'Total 3',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      areaIndex: 2,
    }, {
      caption: 'Total 4',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      isMeasure: true,
    }, {
      caption: 'Total 5',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      isMeasure: true,
    }, {
      caption: 'Total Hidden',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total Hidden 2',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total Hidden 3',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }],
    store: sales,
  },
}));
