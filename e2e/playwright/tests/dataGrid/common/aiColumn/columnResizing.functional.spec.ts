import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';
import type DataCell from '../../../../models/dataGrid/data/cell';

const dataSource = [
  { id: 1, name: 'Name 1', value: 10 },
  { id: 2, name: 'Name 2', value: 20 },
  { id: 3, name: 'Name 3', value: 30 },
];

const getClientWidth = (cell: DataCell): Promise<number> => cell.element.evaluate(
  (element) => element.clientWidth,
);

test.describe('Ai Column.ColumnResizing.Functional', () => {
  (['nextColumn', 'widget'] as const).forEach((columnResizingMode) => {
    const createGrid = (page: Page, options: Properties): Promise<void> => createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      columnResizingMode,
      columnWidth: 100,
      ...options,
    });

    test(`Column resizing should work when allowColumnResizing is true (columnResizingMode = ${columnResizingMode})`, async ({ page }) => {
      await createGrid(page, {
        allowColumnResizing: true,
        columns: [
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAIColumn',
          },
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const dataCell = dataGrid.getDataCell(0, 0);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element).toHaveText('AI Column');
      await expect.poll(() => getClientWidth(dataCell)).toBe(120);

      await dataGrid.resizeHeader(1, 50);

      await expect.poll(() => getClientWidth(dataCell)).toBe(170);
    });

    test(`Column resizing should work when allowResizing is true (columnResizingMode = ${columnResizingMode})`, async ({ page }) => {
      await createGrid(page, {
        allowColumnResizing: false,
        columns: [
          {
            type: 'ai',
            caption: 'AI Column',
            allowResizing: true,
            name: 'myAIColumn',
          },
          {
            dataField: 'id',
            caption: 'ID',
            allowResizing: true,
          },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const dataCell = dataGrid.getDataCell(0, 0);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element).toHaveText('AI Column');
      await expect.poll(() => getClientWidth(dataCell)).toBe(120);

      await dataGrid.resizeHeader(1, 50);

      await expect.poll(() => getClientWidth(dataCell)).toBe(170);
    });

    test(`Column resizing should not work when allowResizing is false (columnResizingMode = ${columnResizingMode})`, async ({ page }) => {
      await createGrid(page, {
        allowColumnResizing: true,
        columns: [
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAIColumn',
            allowResizing: false,
          },
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const dataCell = dataGrid.getDataCell(0, 0);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element).toHaveText('AI Column');
      await expect.poll(() => getClientWidth(dataCell)).toBe(120);

      await dataGrid.resizeHeader(1, 50);

      await expect.poll(() => getClientWidth(dataCell)).toBe(120);
    });

    test(`The column width should not be less than its min width when column resizing (columnResizingMode = ${columnResizingMode})`, async ({ page }) => {
      await createGrid(page, {
        allowColumnResizing: true,
        columns: [
          {
            type: 'ai',
            caption: 'AI Column',
            minWidth: 75,
            name: 'myAIColumn',
          },
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
        ],
      });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
      const dataCell = dataGrid.getDataCell(0, 0);

      await expect.poll(() => dataGrid.isReady()).toBe(true);

      await expect(dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(0).element).toHaveText('AI Column');
      await expect.poll(() => getClientWidth(dataCell)).toBe(100);

      await dataGrid.resizeHeader(1, -50);

      await expect.poll(() => getClientWidth(dataCell)).toBe(75);
    });
  });

  test('DropDownButton should be hidden during resizing', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      allowColumnResizing: true,
      columnWidth: 150,
      columns: [
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAIColumn',
        },
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const aiDropDownButton = dataGrid
      .getHeaders()
      .getHeaderRow(0)
      .getCommandCell(0)
      .getAIDropDownButton();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await aiDropDownButton.element.click();

    await expect.poll(() => aiDropDownButton.isOpened()).toBe(true);

    await dataGrid.resizeHeader(1, 50);

    await expect.poll(() => aiDropDownButton.isOpened()).toBe(false);
  });

  test('AIPromptEditor should be hidden during resizing', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource,
      keyExpr: 'id',
      allowColumnResizing: true,
      columnWidth: 450,
      columns: [
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAIColumn',
          alignment: 'right',
        },
        { dataField: 'id', caption: 'ID' },
      ],
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const aiDropDownButton = dataGrid
      .getHeaders()
      .getHeaderRow(0)
      .getCommandCell(0)
      .getAIDropDownButton();
    const aiPromptEditor = dataGrid.getAIPromptEditor();

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await aiDropDownButton.element.click();

    await expect.poll(() => aiDropDownButton.isOpened()).toBe(true);

    await (await aiDropDownButton.getList()).getItem(0).element.click();

    await expect.poll(() => aiPromptEditor.isVisible()).toBe(true);

    await dataGrid.resizeHeader(1, 50);

    await expect.poll(() => aiPromptEditor.isVisible()).toBe(false);
  });
});
