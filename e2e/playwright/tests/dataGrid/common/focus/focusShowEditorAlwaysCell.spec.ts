import type { Page } from '@playwright/test';
import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';
import List from '../../../../models/list';
import { typeText } from '../../helpers/typeText';

const SELECTOR = '#container';
const OVERLAY_SELECTOR = '.dx-overlay-wrapper';

const createDataGrid = (page: Page): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: [
    {
      A: 'A_0',
      B: 'B_0',
      C: 0,
      D: 'D_0',
    },
    {
      A: 'A_1',
      B: 'B_1',
      C: 1,
      D: 'D_1',
    },
    {
      A: 'A_2',
      B: 'B_2',
      C: 2,
      D: 'D_2',
    },
  ],
  columns: [
    {
      dataField: 'A',
      showEditorAlways: true,
    },
    {
      dataField: 'B',
      showEditorAlways: true,
    },
    {
      dataField: 'C',
      showEditorAlways: true,
      lookup: {
        dataSource: [
          {
            id: 0,
            name: 'LOOKUP_0',
          },
          {
            id: 1,
            name: 'LOOKUP_1',
          },
          {
            id: 2,
            name: 'LOOKUP_2',
          },
        ],
        displayExpr: 'name',
        valueExpr: 'id',
      },
    },
    {
      dataField: 'D',
      showEditorAlways: true,
    },
  ],
  editing: {
    mode: 'cell',
    allowUpdating: true,
    allowAdding: true,
    allowDeleting: true,
  },
});

test.describe('Focus - cell with showEditorAlways', () => {
  test('Should switch focus after the lookup value change [T1194403]', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, SELECTOR);

    const editorTextCell = dataGrid.getDataCell(0, 1);
    const lookupCell = dataGrid.getDataCell(0, 2).getEditor();

    await lookupCell.element.click();

    const list = new List(page, OVERLAY_SELECTOR);
    const item = list.getItem(2);

    await item.element.click();
    await editorTextCell.element.click();

    await testScreenshot(page, 'focus-edit-cell_after-lookup-change.png', { element: dataGrid.element });
  });

  test('Should switch focus after the textBox value change [T1194403]', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page, SELECTOR);

    const textEditorCellOne = dataGrid.getDataCell(0, 1).getEditor();
    const textEditorCellTwo = dataGrid.getDataCell(0, 0).getEditor();

    await textEditorCellOne.element.click();
    await typeText(textEditorCellOne.element, 'TEST_TEXT', { replace: true });
    await textEditorCellTwo.element.click();

    await testScreenshot(page, 'focus-edit-cell_after-text-editor-change.png', { element: dataGrid.element });
  });
});
