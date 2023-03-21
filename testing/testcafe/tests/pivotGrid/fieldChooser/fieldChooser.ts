import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { sales } from '../data.js';
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

  await testScreenshot(t, takeScreenshot, 'FieldChooser change dataField order with invisible fields.png', { element: '.dx-overlay-content.dx-popup-draggable' });

  await t
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

  await testScreenshot(t, takeScreenshot, 'FieldChooser change dataField order with two invisible fields.png', { element: '.dx-overlay-content.dx-popup-draggable' });

  await t
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

  await testScreenshot(t, takeScreenshot, 'FieldChooser change dataField order with three invisible fields.png', { element: '.dx-overlay-content.dx-popup-draggable' });

  await t
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
  const pivotGrid = new PivotGrid('#container');

  await t.click(pivotGrid.getFieldChooserButton());

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  const dataFields = fieldChooser.getDataFields();

  await t
    .expect(dataFields.count)
    .eql(3)
    .expect(dataFields.nth(0).textContent)
    .eql('Total')
    .expect(dataFields.nth(1).textContent)
    .eql('Total 2')
    .expect(dataFields.nth(2).textContent)
    .eql('Total 3');

  await t.click(fieldChooserTreeView.getCheckBoxByNodeIndex(1).element);

  await t
    .expect(dataFields.count)
    .eql(4)
    .expect(dataFields.nth(0).textContent)
    .eql('Total')
    .expect(dataFields.nth(1).textContent)
    .eql('Total 2')
    .expect(dataFields.nth(2).textContent)
    .eql('Total 3')
    .expect(dataFields.nth(3).textContent)
    .eql('Total 5');

  await t.drag(fieldChooser.getDataFields().nth(0), 0, 150);

  await t
    .expect(dataFields.count)
    .eql(4)
    .expect(dataFields.nth(0).textContent)
    .eql('Total 2')
    .expect(dataFields.nth(1).textContent)
    .eql('Total 3')
    .expect(dataFields.nth(2).textContent)
    .eql('Total 5')
    .expect(dataFields.nth(3).textContent)
    .eql('Total');
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
