import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

const dataSource = [
  { id: 1, name: 'Name 1', value: 10 },
  { id: 2, name: 'Name 2', value: 20 },
  { id: 3, name: 'Name 3', value: 30 },
];

test.describe('Ai Column - Sticky columns.Functional', () => {
  test('The AI column should not be fixed when the columnFixing.enabled option is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columnFixing: {
        enabled: true,
      },
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await expect(aiHeader.element).toHaveText('AI Column');
    await aiHeader.expectSticky(undefined, false);
  });

  test('The AI column should be fixed when its fixed option is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          fixed: true,
          name: 'myAiColumn',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await expect(aiHeader.element).toHaveText('AI Column');
    await aiHeader.expectSticky('left');
  });

  test('The AI column should be fixed when its fixed option is true and its fixed position is set to right', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          fixed: true,
          fixedPosition: 'right',
          name: 'myAiColumn',
        },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(3);

    await expect(aiHeader.element).toHaveText('AI Column');
    await aiHeader.expectSticky('right');
  });

  test('The AI column should be fixed when its fixed option is true and its fixed position is set to sticky', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columns: [
        { dataField: 'id', caption: 'ID' },
        {
          type: 'ai',
          caption: 'AI Column',
          fixed: true,
          fixedPosition: 'sticky',
          name: 'myAiColumn',
        },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(1);

    await expect(aiHeader.element).toHaveText('AI Column');
    await aiHeader.expectSticky('sticky');
  });

  test('Fix an AI column using the context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columnFixing: {
        enabled: true,
      },
      columns: [
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const contextMenu = dataGrid.getContextMenu();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    const aiHeader = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0);

    await expect(aiHeader.element).toHaveText('AI Column');
    await aiHeader.expectSticky('left', false);

    await aiHeader.element.click({ button: 'right' });
    await contextMenu.getItemByText('Set Fixed Position').click();
    await contextMenu.getItemByText('Left').click();

    await aiHeader.expectSticky('left');
    await expect(aiHeader.element).toHaveText('AI Column');
  });
});
