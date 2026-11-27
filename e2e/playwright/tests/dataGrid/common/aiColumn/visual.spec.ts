import type { Page } from '@playwright/test';
import type { HorizontalAlignment } from 'devextreme/common';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import DataGrid from '../../../../models/dataGrid';

const createGrid = (
  page: Page,
  alignment?: HorizontalAlignment,
  rtlEnabled?: boolean,
): Promise<void> => createWidget(page, 'dxDataGrid', {
  dataSource: [
    { id: 1, name: 'Name 1', value: 10 },
    { id: 2, name: 'Name 2', value: 20 },
    { id: 3, name: 'Name 3', value: 30 },
  ],
  keyExpr: 'id',
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'name', caption: 'Name' },
    { dataField: 'value', caption: 'Value' },
    {
      type: 'ai',
      caption: 'AI Column',
      name: 'myAiColumn',
      ...alignment && { alignment },
    },
  ],
  ...rtlEnabled !== undefined && { rtlEnabled },
});

test.describe('Ai Column.Visual', () => {
  test('Default render', async ({ page }) => {
    await createGrid(page);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'datagrid__ai-column__default.png', { element: dataGrid.element });
  });

  (['left', 'center', 'right'] as const).forEach((alignment) => {
    [false, true].forEach((rtlEnabled) => {
      test(`AI Column - ${alignment} alignment, RTL ${rtlEnabled}`, async ({ page }) => {
        await createGrid(page, alignment, rtlEnabled);

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await testScreenshot(page, `datagrid__ai-column(alignment=${alignment}_rtlEnabled=${rtlEnabled}).png`, { element: dataGrid.element });
      });

      test(`AI Column: DropDownButton Menu - ${alignment} alignment, RTL ${rtlEnabled}`, async ({ page }) => {
        await createGrid(page, alignment, rtlEnabled);

        const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
        const headerRow = dataGrid.getHeaders().getHeaderRow(0);
        const aiDropDownButton = headerRow.getCommandCell(3).getAIDropDownButton();

        await expect.poll(() => dataGrid.isReady()).toBe(true);

        await aiDropDownButton.element.click();

        await expect.poll(() => aiDropDownButton.isOpened()).toBe(true);

        await testScreenshot(page, `datagrid__ai-column_dropdown-button-menu(alignment=${alignment}_rtlEnabled=${rtlEnabled}).png`, { element: dataGrid.element });
      });
    });
  });
});
