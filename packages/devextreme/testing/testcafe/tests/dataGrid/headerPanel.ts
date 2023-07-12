import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

fixture.disablePageReloads`Header Panel`
  .page(url(__dirname, '../container.html'));

test('Drop-down window should be positioned correctly after resizing the toolbar (T1037975)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid('#container');
  const headerPanel = dataGrid.getHeaderPanel();

  // act
  await t.click(headerPanel.getDropDownMenuButton());

  // assert
  const selectPopup = headerPanel.getDropDownSelectPopup();
  const popupContent = selectPopup.menuContent();

  await t
    .expect(popupContent.exists)
    .ok()
    .expect(popupContent.visible)
    .ok();

  // act
  await t.click(selectPopup.editButton());

  // assert
  const menuItem = selectPopup.getSelectItem(1);

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
