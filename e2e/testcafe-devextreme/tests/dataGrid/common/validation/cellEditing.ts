import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { Themes } from '../../../../helpers/themes';
import { changeTheme } from '../../../../helpers/changeTheme';

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
[
  Themes.materialBlue,
  Themes.fluentBlue,
].forEach((theme) => {
  test('DataGrid - Validation message gets cut off in Fluent and Material themes (T1285387)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid('#container');
    const dataCellEditLink = dataGrid.getDataCell(0, 1).getLinkEdit();

    await t.click(dataCellEditLink);
    await t.pressKey('backspace enter');

    await testScreenshot(t, takeScreenshot, `Invalid-message-word-wrapping-${theme}`, { element: dataGrid.element });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
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
});

test('DataGrid - Validation message is hidden if there is only one Master-Detail row and the row is collapsed (T1287261)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const cellToggle = dataGrid.getDataCell(0, 0).element;
  const textCell = dataGrid.getDataCell(0, 2);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .click(textCell.element)
    .selectText(textCell.getEditor().element)
    .pressKey('backspace enter')
    .click(cellToggle)
    .click(cellToggle)
    .click(textCell.element);

  await t
    .expect(await takeScreenshot('validation-message-shown-after-master-detail-collapse.png', dataGrid.element))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Text: 'Item 1' },
  ],
  keyExpr: 'ID',
  columns: ['ID', {
    dataField: 'Text',
    validationRules: [{ type: 'required' }],
  }],
  editing: { mode: 'batch', allowUpdating: true },
  masterDetail: { enabled: true },
}));
