import DataGrid from 'devextreme-testcafe-models/dataGrid';
import List from 'devextreme-testcafe-models/list';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture`Focus - cell with showEditorAlways`
  .page(url(__dirname, '../../container.html'));

const SELECTOR = '#container';
const OVERLAY_SELECTOR = '.dx-overlay-wrapper';

const createDataGrid = () => createWidget('dxDataGrid', {
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

test('Should switch focus after the lookup value change [T1194403]', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(SELECTOR);

  const editorTextCell = dataGrid.getDataCell(0, 1);
  const lookupCell = dataGrid.getDataCell(0, 2).getEditor();

  await t.click(lookupCell.element);

  const list = new List(OVERLAY_SELECTOR);
  const item = list.getItem(2);

  await t.click(item.element);
  await t.click(editorTextCell.element);

  await takeScreenshot('focus-edit-cell_after-lookup-change.png', dataGrid.element);
  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createDataGrid());

test('Should switch focus after the textBox value change [T1194403]', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(SELECTOR);

  const textEditorCellOne = dataGrid.getDataCell(0, 1).getEditor();
  const textEditorCellTwo = dataGrid.getDataCell(0, 0).getEditor();

  await t.click(textEditorCellOne.element);
  await t.typeText(textEditorCellOne.element, 'TEST_TEXT', { replace: true });
  await t.click(textEditorCellTwo.element);

  await takeScreenshot('focus-edit-cell_after-text-editor-change.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createDataGrid());
