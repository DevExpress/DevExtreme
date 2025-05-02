import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { safeSizeTest } from '../../../../helpers/safeSizeTest';
import { testScreenshot } from '../../../../helpers/themeUtils';

fixture.disablePageReloads`Validation`
  .page(url(__dirname, '../../../container.html'));

[true, false].forEach((repaintChangesOnly) => {
  test(`Navigation with tab without saving should not throw an error (repaintChangesOnly: ${repaintChangesOnly})`, async (t) => {
    const grid = new DataGrid('#container');

    await t.click(grid.getDataCell(0, 0).element);

    const editor = grid.getDataCell(0, 0).getEditor();

    await t.typeText(editor.element, '123');
    await t.pressKey('tab');

    await t.expect(true).ok('no errors');
  }).before(() => createWidget('dxDataGrid', {
    dataSource: [{
      id: 1,
      col2: 30,
      col3: 240,
    },
    {
      id: 2,
      col2: 15,
      col3: 120,
    }],
    keyExpr: 'id',
    repaintChangesOnly,
    columnAutoWidth: true,
    showBorders: true,
    paging: {
      enabled: false,
    },
    editing: {
      mode: 'cell',
      allowUpdating: true,
      allowAdding: true,
    },
    columns: [{
      dataField: 'col2',
      validationRules: [{ type: 'required' }],
    }, {
      dataField: 'col3',
      validationRules: [{ type: 'required' }],
    }],
  }));
});

test('DataGrid - Validation message gets cut off in Fluent and Material themes (T1285387)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const dataCellEditLink = dataGrid.getDataCell(0, 1).getLinkEdit();

  await t.click(dataCellEditLink);
  await t.pressKey('backspace enter');

  await testScreenshot(t, takeScreenshot, 'Invalid_message_word_wrapping', { element: dataGrid.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      { A: 'n' },
    ],
    width: 800,
    editing: {
      mode: 'form',
      allowUpdating: true,
    },
    columns: [{
      dataField: 'A',
      validationRules: [{ type: 'required', message: 'sampletextsampletextsampletextsampletextsampletextsampletextsampletextsampletext' }],
    },
    ],
  });
});
