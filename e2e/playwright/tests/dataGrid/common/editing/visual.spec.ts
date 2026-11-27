/* eslint-disable no-param-reassign */
// Grid callbacks (setCellValue, onSaving, onEditorPreparing) change their arguments: that is their
// API.
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import DataRow from '../../../../models/dataGrid/data/row';
import { getData } from '../../helpers/generateDataSourceData';
import { typeText } from '../../helpers/typeText';

const encodedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIC8+DQo8L3N2Zz4NCg==';

test.describe('Editing.Visual', () => {
  test('The E0110 should not occur when editing a column with setCellValue in form mode (T1193894)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{
        ID: 1,
        Name: 'test',
      }],
      keyExpr: 'ID',
      editing: {
        mode: 'form',
        allowUpdating: true,
        editRowKey: 1,
      },
      columns: [{
        dataField: 'Name',
        setCellValue(rowData, value) {
          rowData.Name = value;
        },
      }],
      templatesRenderAsynchronously: true,
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await typeText(dataGrid.getFormItemEditor(0), 'new');
    await dataGrid.getEditForm().saveButton.click();

    // The form stays for a moment after the click, until the saved row renders in its place.
    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('testnew');
    await testScreenshot(page, 'grid-form-editing-T1193894.png', { element: dataGrid.element });
  });

  test('Checkbox has ink ripple inside editing popup (T977287)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{
        ID: 1,
        LastName: 'Heart',
      }],
      keyExpr: 'ID',
      editing: {
        allowUpdating: true,
        mode: 'popup',
        form: {
          items: [{
            dataField: 'checkbox',
            editorType: 'dxCheckBox',
          }],
        },
      },
      columns: ['LastName'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const popupEditForm = dataGrid.getPopupEditForm();

    await dataGrid.getDataRow(0).getCommandCell(1).getButton(0).click();
    await popupEditForm.form.getByRole('checkbox', { name: 'Checkbox:' }).click();

    await testScreenshot(page, 'grid-popup-editing-checkbox.png', { element: popupEditForm.element });
  });

  test('DataGrid inside editing popup should have synchronized columns (T1059401)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{
        ID: 1,
      }],
      keyExpr: 'ID',
      editing: {
        allowUpdating: true,
        mode: 'popup',
        form: {
          colCount: 1,
          items: [{
            template() {
              return ($('<div>') as any).dxDataGrid({
                showColumnLines: true,
                dataSource: [{
                  ID: 1,
                  FirstName: 'John',
                  LastName: 'Heart',
                }],
                height: 200,
                editing: {
                  allowUpdating: true,
                  allowDeleting: true,
                },
              });
            },
          }],
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const below = await dataGrid.element.evaluate((element) => {
      const body = document.body.getBoundingClientRect();

      return { x: body.left + body.width / 2, y: element.getBoundingClientRect().bottom + 10 };
    });

    await page.mouse.click(below.x, below.y);
    await dataGrid.getDataRow(0).getCommandCell(1).getButton(0).click();

    const popupEditForm = dataGrid.getPopupEditForm();
    // A grid's own element carries no grid class: the grid container (dx-datagrid) is its child.
    const popupDataGrid = new DataGrid(page, popupEditForm.element.locator(':has(> .dx-datagrid)'));

    await expect(popupDataGrid.getDataRow(0).element).toBeAttached();

    await testScreenshot(page, 'grid-popup-editing-grid.png', { element: popupEditForm.element });
  });

  test('DataGrid adaptive text should have correct paddings (T1062084)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [{
        OrderNumber: 35703,
        SaleAmount: 11800,
        OrderDate: '2014/04/10',
        Employee: 'Harv Mudd',
      }],
      keyExpr: 'OrderNumber',
      columnHidingEnabled: true,
      editing: {
        allowUpdating: true,
        mode: 'batch',
      },
      columns: [{
        dataField: 'OrderNumber',
        caption: 'Invoice Number',
        width: 300,
      }, {
        dataField: 'Employee',
      }, {
        dataField: 'OrderDate',
        dataType: 'date',
      }, {
        dataField: 'SaleAmount',
        validationRules: [{ type: 'range', max: 100000 }],
        format: 'currency',
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton().click();
    await dataGrid.getFormItemElement(0).click();
    await typeText(dataGrid.getFormItemEditor(0), '1');
    await page.keyboard.press('Enter');
    await dataGrid.getFormItemElement(2).click();
    await typeText(dataGrid.getFormItemEditor(2), '0');
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'grid-adaptive-item-text.png', { element: dataGrid.element });
  });

  test('DataGrid checkboxes should have correct outline in adaptive row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: [{
        OrderNumber: 35703,
        Employee: 'Sam',
        OrderDate: '2014/04/10',
        Checkbox: true,
      }],
      keyExpr: 'OrderNumber',
      columnHidingEnabled: true,
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      columns: [{
        dataField: 'OrderNumber',
        caption: 'Invoice Number',
        width: 300,
      }, {
        dataField: 'Employee',
      }, {
        dataField: 'OrderDate',
        dataType: 'date',
      }, {
        dataField: 'Checkbox',
        dataType: 'boolean',
      }],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(4).getAdaptiveButton().click();
    await dataGrid.getFormItemElement(2).click();

    await testScreenshot(page, 'grid-adaptive-checkbox.png', { element: dataGrid.element });
  });

  test('DataGrid cell with checkbox should have outline on focused', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 150,
      width: 200,
      dataSource: [{
        Id: 0,
        Checkbox: true,
      }],
      keyExpr: 'Id',
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      columns: ['Id', 'Checkbox'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const cell = dataGrid.getDataCell(0, 0);

    await cell.element.click();
    await cell.expectFocusVisible();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'grid-checkbox-outline.png', { element: dataGrid.element });
  });

  // T1130497
  ([
    ['first', 0, 'standard', 0],
    ['last', 20, 'standard', 0],
    ['pageBottom', 20, 'standard', 0],
    ['pageTop', 0, 'standard', 0],
    ['pageBottom', 5, 'virtual', 0],
    ['pageTop', 0, 'virtual', 0],
    ['viewportBottom', 5, 'standard', 0],
    ['viewportBottom', 8, 'standard', 162],
    ['viewportTop', 0, 'standard', 0],
    ['viewportTop', 3, 'standard', 162],
    ['viewportBottom', 5, 'virtual', 0],
    ['viewportBottom', 8, 'virtual', 162],
    ['viewportTop', 0, 'virtual', 0],
    ['viewportTop', 3, 'virtual', 162],
  ] as const)
    .forEach(([newRowPosition, insertedRowNumber, scrollMode, scrollTop]) => {
      test(`The first cell of the new row should be focused when newRowPosition = ${newRowPosition} and editing.mode = cell and ${scrollMode} scroll mode and scrollTop is ${scrollTop}`, async ({ page }) => {
        await createWidget(page, 'dxDataGrid', {
          dataSource: getData(20, 3),
          height: 400,
          editing: {
            mode: 'cell',
            allowUpdating: true,
            allowAdding: true,
            newRowPosition,
          },
          scrolling: {
            mode: scrollMode,
          },
        });

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        // A new row takes the aria-rowindex of the row it goes before and precedes it in the DOM.
        const insertedRow = new DataRow(dataGrid.getDataRow(insertedRowNumber).element.first());
        const screenshotName = `grid-new-row_position-${newRowPosition}_scroll-mode-${scrollMode}_top-${scrollTop}.png`;

        await dataGrid.scrollTo({ top: scrollTop });
        await expect.poll(() => dataGrid.isReady()).toBe(true);
        await dataGrid.getHeaderPanel().getAddRowButton().click();

        await insertedRow.expectInserted();
        await testScreenshot(page, screenshotName, { element: dataGrid.element });
      });
    });

  test('Popup EditForm screenshot', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2),
      height: 400,
      showBorders: true,
      editing: {
        mode: 'popup',
        allowUpdating: true,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(0).getCommandCell(2).getEditButton().click();

    await expect(dataGrid.getPopupEditForm().element).toBeAttached();
    await testScreenshot(page, 'popup-edit-form.png', { element: dataGrid.element });
  });

  // T1218553
  test('Popup EditForm screenshot when editRowKey is initially specified', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 2).map((item, index) => ({ ...item, id: index })),
      keyExpr: 'id',
      height: 400,
      showBorders: true,
      editing: {
        mode: 'popup',
        allowUpdating: true,
        editRowKey: 0,
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect(dataGrid.getPopupEditForm().element).toBeAttached();
    await testScreenshot(page, 'popup-edit-form-with-initial-editrowkey.png', { element: dataGrid.element });
  });

  [true, false].forEach((useIcons) => {
    // T1179114
    test(`The disabled state should be correct for a custom button when given as a SVG image (useIcons=${useIcons})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        width: 600,
        dataSource: [{
          Id: 0,
          name: 'test',
        }],
        keyExpr: 'Id',
        editing: {
          mode: 'row',
          allowUpdating: true,
          allowDeleting: true,
          useIcons,
        },
        columns: ['Id', 'name', {
          type: 'buttons',
          width: 200,
          buttons: [
            {
              name: 'delete',
              disabled: false,
            },
            {
              name: 'delete',
              disabled: true,
            },
            {
              icon: encodedIcon,
              disabled: false,
            },
            {
              icon: encodedIcon,
              disabled: true,
            },
          ],
        }],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const commandCell = dataGrid.getDataRow(0).getCommandCell(2);
      const firstCustomIcon = commandCell.getButton(2);
      const secondCustomIcon = commandCell.getButton(3);

      await expect.poll(() => firstCustomIcon.evaluate((icon) => icon.clientWidth)).toBe(20);
      await expect.poll(() => secondCustomIcon.evaluate((icon) => icon.clientWidth)).toBe(20);

      await testScreenshot(page, `T1179114-grid-edit-custom-button when-useicons-is-${useIcons}.png`, { element: dataGrid.element });
    });
  });

  // T1201724
  test('An exception should not throw after pressing enter on the save button and onSaving\'s promise is resolved', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      (window as any).deferred = $.Deferred();

      return {
        dataSource: [
          {
            id: 1, field1: 'value1', field2: 'value2', field3: 'value3',
          },
          {
            id: 2, field1: 'value4', field2: 'value5', field3: 'value6',
          },
        ],
        keyExpr: 'id',
        showBorders: true,
        columns: ['field1', 'field2', 'field3'],
        editing: {
          mode: 'row',
          allowUpdating: true,
        },
        onSaving(e) {
          e.promise = (window as any).deferred;
        },
      };
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const dataRow = dataGrid.getDataRow(0);
    const commandCell = dataRow.getCommandCell(3);

    await commandCell.getButton(0).click();
    await dataRow.expectEdited();
    await typeText(dataGrid.getDataCell(0, 0).getEditor().element, 'new_value');
    // The grid moves the focus asynchronously and drops a Tab pressed before it is done.
    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 1).getEditor().element).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dataGrid.getDataCell(0, 2).getEditor().element).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(commandCell.getSaveButton()).toBeFocused();
    await page.keyboard.press('Enter');

    await page.evaluate(() => (window as any).deferred.resolve());

    await dataRow.expectEdited(false);
    await testScreenshot(page, 'grid-editing-with-onSaving-T1201724.png', { element: dataGrid.element });
  });

  test('DataGrid - A new row is added above the existing row if the data source is empty or contains only one record and newRowPosition is set to "pageBottom" (T1287287)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      keyExpr: 'ID',
      editing: {
        mode: 'batch',
        allowAdding: true,
        newRowPosition: 'pageBottom',
      },
      columns: [
        {
          dataField: 'A',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const addRowButton = dataGrid.getHeaderPanel().getAddRowButton();

    await addRowButton.click();
    await addRowButton.click();

    await dataGrid.getDataRow(1).expectInserted();
    await testScreenshot(page, 'newRowPosition-pageBottom-add-row-to-bottom.png', { element: dataGrid.element });
  });

  test('DataGrid - ColorBox in DataGrid causes input value to appear behind color preview (T1280023)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { Color: 'red' },
      ],
      showBorders: true,
      editing: {
        allowUpdating: true,
        mode: 'cell',
      },
      onEditorPreparing(e) {
        if (e.dataField === 'Color') {
          e.editorName = 'dxColorBox';
          e.editorOptions.readOnly = false;
        }
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataCell(0, 0).element.click();

    await testScreenshot(page, 'grid-form-editing-with-color-box.png', { element: dataGrid.element });
  });
});
