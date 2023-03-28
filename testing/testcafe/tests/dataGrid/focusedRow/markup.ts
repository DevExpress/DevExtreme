import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { changeTheme } from '../../../helpers/changeTheme';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';
import { Themes } from '../helpers/themes';

fixture`Focused row - markup`
  .page(url(__dirname, '../../container.html'));

// TODO: Enable multi-theming testcafe run in the future.
[
  Themes.genericLight,
  Themes.materialBlue,
].forEach((theme) => {
  test(`markup - ${theme}`, async (t) => {
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

    await takeScreenshot(`focused-row_markup (${theme}).png`, dataGrid.element);

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);
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
  }).after(async () => changeTheme(Themes.genericLight));
});
