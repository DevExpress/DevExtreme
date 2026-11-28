import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';
import { getData } from '../helpers/generateDataSourceData';
import { typeText } from '../helpers/typeText';

test.describe('Header Panel', () => {
  test('Drop-down window should be positioned correctly after resizing the toolbar (T1037975)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (gridSelector): Properties => ({
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
                const gridInstance = ($(gridSelector) as any).dxDataGrid('instance');
                gridInstance.clearGrouping();
                gridInstance.columnOption(e.value, 'groupIndex', 0);
              },
            },
          },
        ],
      },
    }), DEFAULT_SELECTOR, { arg: DEFAULT_SELECTOR });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();

    // act
    await headerPanel.getDropDownMenuButton().click();

    // assert
    const selectPopup = headerPanel.getDropDownSelectPopup();
    const popupContent = selectPopup.menuContent();

    // The menu holds the load panel of its list too: the popup content comes first.
    await expect(popupContent.first()).toBeVisible();

    // act
    await selectPopup.editButton().click();

    // assert
    const menuItem = selectPopup.getSelectItem(1);

    await expect(menuItem).toBeVisible();

    // act
    await menuItem.click();

    // assert
    await expect.poll(async () => (await dataGrid.apiGetVisibleRows()).length).toBe(3);

    await testScreenshot(page, 'grid-toolbar-dropdown-menu.png', { element: 'body' });
  });

  test('Disabled toolbar buttons should be grayed out (T1217416)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataRow(4).element).toBeAttached();

    await testScreenshot(page, 'disabled-toolbar-buttons.png', { element: dataGrid.element });
  });

  test('Toolbar should render on changing visibility if visibility is false initially', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect(dataGrid.getHeaderPanel().element).toBeHidden();

    await dataGrid.option('toolbar.visible', true);

    await expect(dataGrid.getHeaderPanel().element).toBeVisible();
    await expect(dataGrid.getHeaderPanel().element.locator('.dx-button')).toHaveText('myTestButton');

    await dataGrid.option('toolbar.visible', false);

    await expect(dataGrid.getHeaderPanel().element).toBeHidden();
  });

  test('Toolbar should not reset its widget values when changing the disabled property', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      showBorders: true,
      toolbar: {
        items: [{
          widget: 'dxTextBox',
        }],
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const toolbar = dataGrid.getToolbar();
    const textBox = toolbar.getItem(0);

    // act
    await typeText(textBox.locator('input'), 'test');

    // assert
    await expect(textBox.locator('input')).toHaveValue('test');

    // act
    await dataGrid.option('toolbar.disabled', false);

    // assert
    await expect(textBox.locator('input')).toHaveValue('test');
  });

  test('Invisible toolbar doesn\'t have additional paddings (T1261773)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(5, 3),
      keyExpr: 'field_0',
      toolbar: {
        items: ['columnChooserButton'],
        visible: false,
      },
    });

    await testScreenshot(page, 'invisible-toolbar-buttons.png');
  });
});
