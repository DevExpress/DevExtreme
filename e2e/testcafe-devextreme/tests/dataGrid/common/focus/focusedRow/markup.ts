import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { testScreenshot } from '../../../../../helpers/themeUtils';

fixture.disablePageReloads`Focused row - markup`
  .page(url(__dirname, '../../../../container.html'));

// TODO: Enable multi-theming testcafe run in the future.
// visual: generic.light
// visual: material.blue.light
test('markup - generic.light', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const firstCell = dataGrid.getDataCell(0, 0);
  const secondCell = dataGrid.getDataCell(0, 1);
  const thirdCell = dataGrid.getDataCell(0, 2);

  await t.click(firstCell.element);
  await t.typeText(firstCell.getEditor().element, 'TEST', { replace: true });

  await t.click(secondCell.element);
  await t.typeText(secondCell.getEditor().element, ' ', { replace: true });

  await t.click(thirdCell.element);

  await testScreenshot(t, takeScreenshot, 'focused-row_markup.png', { element: dataGrid.element });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    keyExpr: 'id',
    focusedRowEnabled: true,
    editing: {
      mode: 'batch',
      allowUpdating: true,
    },
    dataSource: [{
      id: 0,
      dataA: 'dataA_1',
      dataB: 'dataB_1',
      dataC: 'dataC_1',
    }, {
      id: 1,
      dataA: 'dataA_2',
      dataB: 'dataB_2',
      dataC: 'dataC_2',
    }],
    columns: [{
      dataField: 'dataA',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'dataB',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'dataC',
      validationRules: [{ type: 'required' }],
    }],
  });
});

// visual: generic.light
// visual: fluent.light
// visual: material.blue.light
test('Invalid cells in a focused row should have the correct background color (T1197268) - generic.light', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  // act
  await dataGrid.apiAddRow();
  await dataGrid.apiSaveEditData();
  // assert
  await testScreenshot(t, takeScreenshot, 'focused-row-invalid-cells.png');
  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    keyExpr: 'id',
    focusedRowEnabled: true,
    editing: {
      allowAdding: true,
    },
    dataSource: [{
      id: 0,
      dataA: 'dataA_1',
      dataB: 'dataB_1',
      dataC: 'dataC_1',
    }, {
      id: 1,
      dataA: 'dataA_2',
      dataB: 'dataB_2',
      dataC: 'dataC_2',
    }],
    columns: [{
      dataField: 'dataA',
      validationRules: [{ type: 'required' }],
    }, 'dataB', 'dataC'],
  });
});

// visual: generic.light
// visual: material.blue.light
// visual: fluent.blue.light
test('Link should not have background color in generic.light (T1282624)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  // assert
  await testScreenshot(t, takeScreenshot, 'focused-row-link-background.png');
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('#container tr.dx-row-focused td { background-color: red }');

  await createWidget('dxDataGrid', {
    dataSource: [
      { id: 0, text: 'text_1' },
      { id: 1, text: 'text_2' },
      { id: 2, text: 'text_3' },
    ],
    focusedRowEnabled: true,
    editing: {
      allowDeleting: true,
      useIcons: false,
    },
    focusedRowKey: 1,
    keyExpr: 'id',
  });
});
