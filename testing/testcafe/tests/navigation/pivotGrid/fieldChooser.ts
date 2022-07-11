import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { sales } from './data.js';
import PivotGrid from '../../../model/pivotGrid';

fixture`PivotGrid_fieldChooser`
  .page(url(__dirname, '../../container.html'));

test('Change dataFiels order with one invisible field (T1079461)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(0).element);
  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(1).element);

  await t.drag(fieldChooser.getDataFields().nth(0), 0, 170);

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

  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(0).element);
  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(1).element);

  await t.drag(fieldChooser.getDataFields().nth(0), 0, 170);

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

test('Change dataFiels order with three invisible fields (T1079461)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(0).element);

  await t.drag(fieldChooser.getDataFields().nth(0), 0, 170);

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

test('Change dataFiels order when applyChangesMode is "onDemand" (T1097764)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(0).element);
  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(1).element);

  await t.drag(fieldChooser.getDataFields().nth(0), 0, 155);

  await t
    .expect(await takeScreenshot('Change_dataField_order_applyChangesMode_onDemand.png', '.dx-overlay-content.dx-popup-draggable'))
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
    applyChangesMode: 'onDemand',
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
    }, {
      caption: 'Total Hidden 4',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total Hidden 5',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      visible: false,
      isMeasure: true,
    }, {
      caption: 'Total Hidden 6',
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
