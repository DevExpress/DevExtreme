import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';

test.describe('Summary', () => {
  test('Group footer summary should be focusable', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
      ],
      columns: [
        'id',
        {
          dataField: 'value',
          groupIndex: 0,
        },
      ],
      summary: {
        groupItems: [
          {
            column: 'id',
            summaryType: 'count',
            showInGroupFooter: true,
          },
        ],
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(4).getDataCell(1).element.click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'group-summary-focused.png', { element: dataGrid.element });
  });

  test('Total summary should be focusable', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value: 1 },
        { id: 2, value: 1 },
        { id: 3, value: 1 },
        { id: 4, value: 1 },
      ],
      summary: {
        totalItems: [
          {
            column: 'id',
            summaryType: 'count',
          },
        ],
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(3).element.click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'total-summary-focused.png', { element: dataGrid.element });
  });

  test('Focused total summary should have right appearance with sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value1: 1, value2: 2 },
        { id: 2, value1: 1, value2: 2 },
        { id: 3, value1: 1, value2: 2 },
        { id: 4, value1: 1, value2: 2 },
      ],
      columns: [
        { dataField: 'value1', fixed: true },
        { dataField: 'value2' },
      ],
      summary: {
        totalItems: [
          {
            column: 'value1',
            summaryType: 'count',
          },
          {
            column: 'value2',
            summaryType: 'count',
          },
        ],
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getDataRow(3).element.click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'total-summary-focused-with-sticky.png', { element: dataGrid.element });
  });

  test('Group footer navigation should work without keyboard trap', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, value1: 1, value2: 1 },
        { id: 2, value1: 1, value2: 1 },
        { id: 3, value1: 1, value2: 1 },
        { id: 4, value1: 1, value2: 1 },
      ],
      columns: [
        'id',
        {
          dataField: 'value1',
          groupIndex: 0,
        },
        'value2',
      ],
      summary: {
        groupItems: [
          {
            column: 'id',
            summaryType: 'count',
            showInGroupFooter: true,
          },
        ],
        totalItems: [
          {
            column: 'id',
            summaryType: 'count',
          },
        ],
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await dataGrid.getDataRow(4).getDataCell(1).element.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');

    await expect(dataGrid.getFooterRow()).toBeFocused();
  });

  test('The group summary should be displayed next to the grouped value when the grouped column has the showWhenGrouped option enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        {
          id: 1, value1: 1, value2: 2, value3: 3,
        },
        {
          id: 2, value1: 4, value2: 5, value3: 6,
        },
        {
          id: 3, value1: 7, value2: 8, value3: 9,
        },
        {
          id: 4, value1: 10, value2: 11, value3: 12,
        },
      ],
      columns: [
        'id',
        'value1',
        'value2',
        {
          dataField: 'value3',
          groupIndex: 0,
          showWhenGrouped: true,
        },
      ],
      summary: {
        groupItems: [
          {
            column: 'value3',
            summaryType: 'count',
            displayFormat: '{0} VALUE3 GROUP COUNT',
            alignByColumn: true,
          },
        ],
      },
    });

    // arrange, act
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'group-summary-when-grouped-column-has-showWhenGrouped.png', { element: dataGrid.element });
  });
});
