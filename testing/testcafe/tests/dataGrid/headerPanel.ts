import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

fixture`Header Panel`
  .page(url(__dirname, '../container.html'));

test('Drop-down window should be positioned correctly after resizing the toolbar (T1037975)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const menuButton = dataGrid.getHeaderPanel().getDropDownMenuButton();

  const { popup } = dataGrid.getToolbar();
  const popupContent = popup.element;
  const dropDownEditorButton = popup.getDropDownEditorButton();
  const menuItem = popup.getMenuItem();

  // act
  await t.click(menuButton);

  // assert
  await t
    .expect(popupContent.exists)
    .ok()
    .expect(popupContent.visible)
    .ok();

  // act
  await t.click(dropDownEditorButton);

  // assert
  await t
    .expect(menuItem.exists)
    .ok()
    .expect(menuItem.visible)
    .ok();

  // act
  await t.click(menuItem);

  const visibleRows = await dataGrid.apiGetVisibleRows();

  // assert
  await t
    .expect(visibleRows.length)
    .eql(3)
    .expect(await takeScreenshot('grid-toolbar-dropdown-menu.png', 'body'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { ID: 1, Name: 'Name 1', Category: 'Category 1' },
    { ID: 2, Name: 'Name 2', Category: 'Category 1' },
  ],
  keyExpr: 'ID',
  columns: ['ID', { dataField: 'Name', groupIndex: 0 }, 'Category'],
  toolbar: {
    items: [
      {
        location: 'before',
        locateInMenu: 'always',
        widget: 'dxSelectBox',
        options: {
          width: 200,
          items: ['Name', 'Category'],
          value: 'Name',
          onValueChanged(e) {
            const gridInstance = ($('#container') as any).dxDataGrid('instance');
            gridInstance.clearGrouping();
            gridInstance.columnOption(e.value, 'groupIndex', 0);
          },
        },
      },
    ],
  },
}));
