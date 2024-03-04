import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from '../../helpers/themes';

fixture.disablePageReloads`Search Panel`
  .page(url(__dirname, '../container.html'));

const CLASSES = {
  changed: 'dx-datagrid-cell-updated-animation',
};

// T1195478
test.skip('Cells should not be highlighted after opening cell as edited', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getDataRow(0).getDataCell(0).element);
  await t.click(dataGrid.getDataRow(1).getDataCell(0).element);

  await t
    .expect(dataGrid.getDataRow(0).getDataCell(0).element.classNames)
    .notContains(CLASSES.changed)
    .expect(dataGrid.getDataRow(1).getDataCell(0).element.classNames)
    .notContains(CLASSES.changed);
}).before(async () => {
  await changeTheme(Themes.materialBlue);

  return createWidget('dxDataGrid', {
    dataSource: [
      { column1: 'first' },
      { column1: 'second' },
    ],
    columns: ['column1'],
    keyExpr: 'column1',
    editing: {
      mode: 'cell',
      allowUpdating: true,
    },
    highlightChanges: true,
    repaintChangesOnly: true,
  });
}).after(async () => { await changeTheme(Themes.genericLight); });
