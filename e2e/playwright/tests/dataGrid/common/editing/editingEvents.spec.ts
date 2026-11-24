import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { getFirstDataRow } from '../../helpers/getFirstDataRow';
import { typeText } from '../../helpers/typeText';

const GRID_SELECTOR = '#container';

interface CancelCase {
  caseName: string;
  cancel: boolean;
  isPromise: boolean;
}

// T1186997
// A canceled change leaves the row as it was, which a check would also see before the grid has
// processed the change: each test waits for the grid first.
const cancelCases: CancelCase[] = [
  { caseName: 'e.cancel = promise:true', cancel: true, isPromise: true },
  { caseName: 'e.cancel = true', cancel: true, isPromise: false },
  { caseName: 'e.cancel = promise:false', cancel: false, isPromise: true },
  { caseName: 'e.cancel = false', cancel: false, isPromise: false },
];

test.describe('Editing events', () => {
  cancelCases.forEach(({ caseName, cancel, isPromise }) => {
    test(`onRowUpdating event should be work valid in case '${caseName}'`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (cancelCase) => ({
        dataSource: [{
          ID: 1,
          FirstName: 'John',
        }],
        columns: [{
          dataField: 'FirstName',
          caption: 'Firs tName',
        }],
        height: 300,
        editing: {
          mode: 'row',
          allowUpdating: true,
        },
        onRowUpdating(e) {
          e.cancel = cancelCase.isPromise ? Promise.resolve(cancelCase.cancel) : cancelCase.cancel;
        },
      }), GRID_SELECTOR, { arg: { cancel, isPromise } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const dataRow = dataGrid.getDataRow(0);

      await dataRow.getCommandCell(1).getEditButton().click();
      await typeText(dataRow.getDataCell(0).getEditor().element, 'test text');
      await dataRow.getCommandCell(1).getSaveButton().click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataRow.getCommandCell(1).getSaveButton()).toBeAttached({ attached: cancel });
    });
  });

  cancelCases.forEach(({ caseName, cancel, isPromise }) => {
    test(`onRowInserting event should be work valid in case '${caseName}'`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (cancelCase) => ({
        dataSource: [],
        columns: [{
          dataField: 'FirstName',
          caption: 'Firs tName',
        }],
        height: 300,
        editing: {
          mode: 'row',
          allowAdding: true,
        },
        onRowInserting(e) {
          e.cancel = cancelCase.isPromise ? Promise.resolve(cancelCase.cancel) : cancelCase.cancel;
        },
      }), GRID_SELECTOR, { arg: { cancel, isPromise } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const dataRow = dataGrid.getDataRow(0);

      await dataGrid.getHeaderPanel().getAddRowButton().click();
      await typeText(dataRow.getDataCell(0).getEditor().element, 'test text');
      await dataRow.getCommandCell(1).getSaveButton().click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataRow.getDataCell(0).getEditor().element).toBeAttached({ attached: cancel });
      await expect(dataRow.getCommandCell(1).getSaveButton()).toBeAttached({ attached: cancel });
    });
  });

  cancelCases.forEach(({ caseName, cancel, isPromise }) => {
    test(`onRowRemoving event should be work valid in case '${caseName}'`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', (cancelCase) => ({
        dataSource: [{
          ID: 1,
          FirstName: 'John',
        }],
        columns: [{
          dataField: 'FirstName',
          caption: 'Firs tName',
        }],
        height: 300,
        editing: {
          mode: 'row',
          allowDeleting: true,
          confirmDelete: false,
        },
        onRowRemoving(e) {
          e.cancel = cancelCase.isPromise ? Promise.resolve(cancelCase.cancel) : cancelCase.cancel;
        },
      }), GRID_SELECTOR, { arg: { cancel, isPromise } });

      const dataGrid = new DataGrid(page, GRID_SELECTOR);
      const dataRow = dataGrid.getDataRow(0);

      await dataRow.getCommandCell(1).getDeleteButton().click();
      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataRow.element).toBeAttached({ attached: cancel });
    });
  });

  // T1250405
  test('DataGrid - Canceled rows are hidden when multiple rows are added in batch mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { ID: 1, Text: 'Item 1' },
      ],
      keyExpr: 'ID',
      columns: ['Text'],
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      onRowInserting(e) {
        e.cancel = new Promise<boolean>((resolve) => {
          const dialog = (window as any).DevExpress.ui.dialog.confirm(
            'Are you sure?',
            'Confirm changes',
          );
          dialog.done((confirm) => resolve(!confirm));
        });
      },
    }));

    const dataGrid = new DataGrid(page, GRID_SELECTOR);
    const headerPanel = dataGrid.getHeaderPanel();

    const addRow = async (text: string): Promise<void> => {
      await headerPanel.getAddRowButton().click();
      // A new row goes on top, and its first cell opens the editor.
      await expect(getFirstDataRow(dataGrid).getDataCell(0).getEditor().element).toBeFocused();
      await page.keyboard.press(text);
    };

    await addRow('1');
    await addRow('2');
    await headerPanel.getSaveButton().click();

    // Each new row opens its own dialog, in the order the rows were added.
    const dialogs = dataGrid.getDialog();
    await expect(dialogs).toHaveCount(2);

    const firstRowDialog = dialogs.nth(0);
    const secondRowDialog = dialogs.nth(1);

    await secondRowDialog.getByRole('button', { name: 'No' }).click();
    await firstRowDialog.getByRole('button', { name: 'Yes' }).click();
    await expect(dialogs).toHaveCount(0);

    await testScreenshot(page, 'T1250405-canceled-rows-hidden.png', { element: dataGrid.element });
  });
});
