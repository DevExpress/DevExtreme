import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import PivotGrid from '../../../../models/pivotGrid';
import { sales } from '../data';

const FIELD_CHOOSER_POPUP_SELECTOR = '.dx-overlay-content.dx-popup-draggable';

test('Change dataFiels order with one invisible field (T1079461)', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
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
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await fieldChooserTreeView.getCheckBoxByNodeIndex(0).element.click();
  await fieldChooserTreeView.getCheckBoxByNodeIndex(1).element.click();

  await dragToOffset(page, fieldChooser.getDataFields().nth(0), 0, 170);

  await testScreenshot(page, 'FieldChooser change dataField order with invisible fields.png', { element: FIELD_CHOOSER_POPUP_SELECTOR });
});

test('Change dataFiels order with two invisible fields', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
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
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await fieldChooserTreeView.getCheckBoxByNodeIndex(0).element.click();
  await fieldChooserTreeView.getCheckBoxByNodeIndex(1).element.click();

  await dragToOffset(page, fieldChooser.getDataFields().nth(0), 0, 170);

  await testScreenshot(page, 'FieldChooser change dataField order with two invisible fields.png', { element: FIELD_CHOOSER_POPUP_SELECTOR });
});

test('Change dataFiels order with three invisible fields (T1079461)', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
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
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();

  await fieldChooserTreeView.getCheckBoxByNodeIndex(0).element.click();

  await dragToOffset(page, fieldChooser.getDataFields().nth(0), 0, 170);

  await testScreenshot(page, 'FieldChooser change dataField order with three invisible fields.png', { element: FIELD_CHOOSER_POPUP_SELECTOR });
});

test('Change dataFiels order when applyChangesMode is "onDemand" (T1097764)', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
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
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  const fieldChooser = pivotGrid.getFieldChooser();
  const fieldChooserTreeView = fieldChooser.getTreeView();
  const dataFields = fieldChooser.getDataFields();

  await expect(dataFields).toHaveText(['Total', 'Total 2', 'Total 3']);

  await fieldChooserTreeView.getCheckBoxByNodeIndex(1).element.click();

  await expect(dataFields).toHaveText(['Total', 'Total 2', 'Total 3', 'Total 5']);

  await dragToOffset(page, fieldChooser.getDataFields().nth(0), 0, 150);

  await expect(dataFields).toHaveText(['Total 2', 'Total 3', 'Total 5', 'Total']);
});

test('Field chooser can be clicked (T1290333)', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    showBorders: true,
    fieldPanel: {
      showFilterFields: false,
      visible: true,
    },
    dataSource: {
      fields: [{
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }],
      store: [],
    },
  });

  const pivotGrid = new PivotGrid(page, '#container');

  await pivotGrid.getFieldChooserButton().click();

  await expect(pivotGrid.getFieldChooser().element).toBeAttached();
});
