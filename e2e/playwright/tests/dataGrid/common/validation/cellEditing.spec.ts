import { test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import { typeText } from '../../helpers/typeText';

test.describe('Validation', () => {
  [true, false].forEach((repaintChangesOnly) => {
    test(`Navigation with tab without saving should not throw an error (repaintChangesOnly: ${repaintChangesOnly})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
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
      });

      const grid = new DataGrid(page, DEFAULT_SELECTOR);

      await grid.getDataCell(0, 0).element.click();

      const editor = grid.getDataCell(0, 0).getEditor();

      await typeText(editor.element, '123');
      await page.keyboard.press('Tab');
    });
  });

  test('DataGrid - Validation message gets cut off (T1285387)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const dataCellEditLink = dataGrid.getDataCell(0, 1).getLinkEdit();

    await dataCellEditLink.click();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'Invalid-message-word-wrapping.png', { element: dataGrid.element });
  });

  test('DataGrid - Validation message is hidden if there is only one Master-Detail row and the row is collapsed (T1287261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const cellToggle = dataGrid.getDataCell(0, 0).element;
    const textCell = dataGrid.getDataCell(0, 2);

    await textCell.element.click();
    await textCell.getEditor().element.selectText();
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Enter');
    await cellToggle.click();
    await cellToggle.click();
    await textCell.element.click();

    await testScreenshot(page, 'validation-message-shown-after-master-detail-collapse.png', { element: dataGrid.element });
  });
});
