import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { changeTheme } from '../../../../helpers/changeTheme';
import { testScreenshot } from '../../../../helpers/themeUtils';
import { Themes } from '../../../../helpers/themes';

fixture.disablePageReloads`DataGrid deleted row height consistency T1286265`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';
// check first and second rows, because both can have issue independently each other
const ROW_INDEXES = [0, 1];

[
  Themes.fluentBlue,
  Themes.fluentBlueCompact,
  Themes.materialBlue,
  Themes.materialBlueCompact,
  Themes.genericLight,
  Themes.genericLightCompact,
].forEach((theme) => {
  ROW_INDEXES.forEach((rowIndex) => {
    test(`Row height should not change when marked as deleted - ${theme} - row - ${rowIndex}`, async (t) => {
      // Arrange
      const { takeScreenshot } = createScreenshotsComparer(t);
      const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

      // Get the initial height of the row at index
      const initialRow = dataGrid.getDataRow(rowIndex);
      const initialRowHeight = await initialRow.element.clientHeight;

      // Act - mark the row as deleted
      await dataGrid.apiDeleteRow(rowIndex);

      // Assert - check if the row is marked as deleted
      await t
        .expect(dataGrid.getDataRow(rowIndex).isRemoved)
        .ok('Row should be marked as deleted');

      // Get the height of the deleted row
      const deletedRow = dataGrid.getDataRow(rowIndex);
      const deletedRowHeight = await deletedRow.element.clientHeight;

      // Assert - check if the height remains consistent
      await t
        .expect(deletedRowHeight)
        .eql(initialRowHeight, 'Row height should not change when marked as deleted');

      // Take a screenshot for visual verification
      await testScreenshot(t, takeScreenshot, `datagrid-deleted-row-height-${theme}`, {
        element: dataGrid.element,
        theme,
      });
    }).before(async () => {
      await changeTheme(theme);

      await createWidget('dxDataGrid', {
        dataSource: [
          { id: 1, name: 'John Smith' },
          { id: 2, name: 'Jane Johnson' },
          { id: 3, name: 'Mike Wilson' },
        ],
        keyExpr: 'id',
        height: 300,
        showBorders: true,
        columnFixing: { enabled: true },
        columns: [
          {
            dataField: 'id', caption: 'ID', width: 50, fixed: true,
          },
          { dataField: 'name', caption: 'Full Name', width: 150 },
        ],
        editing: {
          mode: 'batch',
          allowDeleting: true,
        },
      });
    }).after(async () => {
      await changeTheme(Themes.genericLight);
    });
  });
});
