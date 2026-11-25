import { expect, test } from '../../../../fixtures';
import { mockApi } from '../../../../helpers/apiMock';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import { typeText } from '../../helpers/typeText';

const apiRequestMock = [{
  url: /\/api\/data/,
  body: {
    data: [
      {
        id: 0,
        data: 'A',
      }, {
        id: 1,
        data: 'B',
      }, {
        id: 2,
        data: 'C',
      },
    ],
  },
}, {
  url: /\/api\/update/,
  body: {},
}];

test.describe('Editing - cell focus', () => {
  // T1154721
  test('Should allow focus next editor in the same column after save changes with local data source', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'A',
      }, {
        id: 1,
        data: 'B',
      }, {
        id: 2,
        data: 'C',
      }],
      editing: {
        allowUpdating: true,
        refreshMode: 'repaint',
        mode: 'cell',
      },
      columns: [{
        dataField: 'data',
        showEditorAlways: true,
      }],
      repaintChangesOnly: true,
    });

    const dataGrid = new DataGrid(page, '#container');
    const firstCell = dataGrid.getDataCell(0, 0);
    const middleCell = dataGrid.getDataCell(1, 0);
    const secondCell = dataGrid.getDataCell(2, 0);

    await typeText(firstCell.getEditor().element, ' AAA');
    await typeText(secondCell.getEditor().element, ' CCC');
    await middleCell.element.click();

    await expect(firstCell.getEditor().element).toHaveValue('A AAA');
    await expect(secondCell.getEditor().element).toHaveValue('C CCC');
  });

  // T1037019
  test('Should allow focus next editor in the same column after save changes with remote data source', async ({ page }) => {
    await mockApi(page, apiRequestMock);
    await createWidget(page, 'dxDataGrid', () => ({
      keyExpr: 'id',
      dataSource: (window as any).DevExpress.data.AspNet.createStore({
        key: 'id',
        loadUrl: 'https://api/data',
        updateUrl: 'https://api/update',
      }),
      editing: {
        allowUpdating: true,
        refreshMode: 'repaint',
        mode: 'cell',
      },
      columns: [{
        dataField: 'data',
        showEditorAlways: true,
      }],
      repaintChangesOnly: true,
    }));

    const dataGrid = new DataGrid(page, '#container');
    const firstCell = dataGrid.getDataCell(0, 0);
    const middleCell = dataGrid.getDataCell(1, 0);
    const secondCell = dataGrid.getDataCell(2, 0);

    await typeText(firstCell.getEditor().element, ' AAA');
    await typeText(secondCell.getEditor().element, ' CCC');
    await middleCell.element.click();

    await expect(firstCell.getEditor().element).toHaveValue('A AAA');
    await expect(secondCell.getEditor().element).toHaveValue('C CCC');
  });
});
