import { expect, test } from '../../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../../helpers/const';
import { createWidget } from '../../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../../helpers/domUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import DataGrid from '../../../../../models/dataGrid';
import { typeText } from '../../../helpers/typeText';

test.describe('Focused row - markup', () => {
  test('markup', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
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

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const firstCell = dataGrid.getDataCell(0, 0);
    const secondCell = dataGrid.getDataCell(0, 1);
    const thirdCell = dataGrid.getDataCell(0, 2);

    await firstCell.element.click();
    await typeText(firstCell.getEditor().element, 'TEST', { replace: true });

    await secondCell.element.click();
    await typeText(secondCell.getEditor().element, ' ', { replace: true });

    await thirdCell.element.click();

    await testScreenshot(page, 'focused-row_markup.png', { element: dataGrid.element });
  });

  test('Invalid cells in a focused row should have the correct background color (T1197268)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      focusedRowEnabled: true,
      editing: {
        allowAdding: true,
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
      }, 'dataB', 'dataC'],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.apiAddRow();
    await dataGrid.apiSaveEditData();

    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await testScreenshot(page, 'focused-row-invalid-cells.png');
  });

  test('Link should not have background color (T1282624)', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `${DEFAULT_SELECTOR} tr.dx-row-focused td { background-color: red }`);

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 0, text: 'text_1' },
        { id: 1, text: 'text_2' },
        { id: 2, text: 'text_3' },
      ],
      focusedRowEnabled: true,
      editing: {
        allowDeleting: true,
        useIcons: false,
      },
      focusedRowKey: 1,
      keyExpr: 'id',
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'focused-row-link-background.png');
  });
});
