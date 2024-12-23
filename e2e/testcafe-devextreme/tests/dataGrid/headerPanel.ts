import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { Themes } from '../../helpers/themes';
import { changeTheme } from '../../helpers/changeTheme';
import { getData } from './helpers/generateDataSourceData';

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

[
  Themes.genericLight,
  Themes.genericDark,
  Themes.materialBlue,
  Themes.materialBlueDark,
  Themes.fluentBlue,
  Themes.fluentBlueDark,
].forEach((theme) => {
  test(`Disabled toolbar buttons are not grayed out in Material themes (T1217416) in ${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid('#container');

    await t
      .expect(await takeScreenshot(`disabled-toolbar-buttons-${theme}.png`, dataGrid.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(5, 3),
      keyExpr: 'field_0',
      showBorders: true,
      toolbar: {
        items: ['saveButton', 'revertButton', 'applyFilterButton'],
      },
      filterRow: { visible: true, applyFilter: 'onClick' },
      editing: {
        mode: 'batch',
        allowUpdating: true,
      },
    });
  }).after(async () => {
    await changeTheme(Themes.genericLight);
  });
});

test('Toolbar should render on changing visibility if visibility is false initially', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .expect(dataGrid.getHeaderPanel().element.visible)
    .notOk();

  await dataGrid.option('toolbar.visible', true);

  await t
    .expect(dataGrid.getHeaderPanel().element.visible)
    .ok()
    .expect(dataGrid.getHeaderPanel().element.find('.dx-button').textContent)
    .eql('myTestButton');

  await dataGrid.option('toolbar.visible', false);

  await t
    .expect(dataGrid.getHeaderPanel().element.visible)
    .notOk();
}).before(async () => createWidget('dxDataGrid', {
  showBorders: true,
  toolbar: {
    items: [{
      location: 'before',
      widget: 'dxButton',
      options: {
        text: 'myTestButton',
      },
    }],
    visible: false,
  },
}));

test('Toolbar should not reset its widget values when changing the disabled property', async (t) => {
  const dataGrid = new DataGrid('#container');
  const toolbar = dataGrid.getToolbar();
  const textBox = toolbar.getItem(0);

  // act
  await t.typeText(textBox, 'test');

  // assert
  await t
    .expect(textBox.find('input').value)
    .eql('test');

  // act
  await dataGrid.option('toolbar.disabled', false);

  // assert
  await t
    .expect(textBox.find('input').value)
    .eql('test');
}).before(async () => createWidget('dxDataGrid', {
  showBorders: true,
  toolbar: {
    items: [{
      widget: 'dxTextBox',
    }],
  },
}));

[
  Themes.genericLight,
  Themes.materialBlue,
  Themes.fluentBlue,
].forEach((theme) => {
  test(`Invisible toolbar doesn't have additional paddings (T1261773) in ${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid('#container');

    await t
      .expect(await takeScreenshot(`invisible-toolbar-buttons-${theme}.png`, dataGrid.element))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: getData(5, 3),
      keyExpr: 'field_0',
      toolbar: {
        items: ['columnChooserButton'],
        visible: false,
      },
    });
  }).after(async () => {
    await changeTheme(Themes.genericLight);
  });
});
