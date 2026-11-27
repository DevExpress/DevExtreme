import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import DataGrid from '../../../../models/dataGrid';
import { typeText } from '../../helpers/typeText';
import {
  createGridWithAIAssistant,
  createRemoteGridWithAIAssistant,
  threeRows,
  twoRows,
} from './testHelpers';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const allHiddenColumns = [
  { dataField: 'id', visible: false },
  { dataField: 'name', visible: false },
  { dataField: 'value', visible: false },
];

test.describe('AI Assistant - Commands', () => {
  test('Single sorting command should execute successfully and update grid', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: threeRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('No-args command (clearSorting) should execute successfully', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: threeRows,
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'name', sortOrder: 'asc' },
        { dataField: 'value' },
      ],
      showBorders: true,
    }, [
      { actions: [{ name: 'clearSorting', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Clear sorting');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeUndefined();
  });

  test('Multi-command request should show all success entries', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: threeRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      searchPanel: { visible: true },
    }, [
      {
        actions: [
          { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
          { name: 'searching', args: { text: 'Alice' } },
        ],
      },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name and search for Alice');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getActionItems()).toHaveCount(2);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(2);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    await expect.poll(() => dataGrid.apiOption('searchPanel.text')).toBe('Alice');
  });

  test('Multi-command sequential ordering should be reflected in grid state', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: threeRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      {
        actions: [
          { name: 'sorting', args: { dataField: 'name', sortOrder: 'desc' } },
          { name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } },
        ],
      },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name desc then asc');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getActionItems()).toHaveCount(2);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(2);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Single command should succeed with local array data source', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: threeRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'value', sortOrder: 'desc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by value');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('value', 'sortOrder')).toBe('desc');
  });

  test('Remote data parity — command should succeed with server-side data source', async ({ page }) => {
    await createRemoteGridWithAIAssistant(
      page,
      [
        { id: 1, name: 'Charlie', value: 10 },
        { id: 2, name: 'Alice', value: 30 },
        { id: 3, name: 'Bob', value: 20 },
      ],
      {
        columns: ['id', 'name', 'value'],
        showBorders: true,
      },
      [
        { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
      ],
    );

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name ascending');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Group then ungroup across two prompts should both succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [
        { id: 1, name: 'Alice', value: 30 },
        { id: 2, name: 'Bob', value: 20 },
        { id: 3, name: 'Alice', value: 10 },
      ],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
      { actions: [{ name: 'clearGrouping', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Group by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'groupIndex')).toBe(0);

    await typeText(aiChat.getInput(), 'Clear grouping');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessage(1).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'groupIndex')).toBeUndefined();
  });

  test('Filter then clear filter across two prompts should both succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: threeRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      {
        actions: [{
          name: 'filterValue',
          args: {
            expression: {
              rootId: 'n1',
              nodes: [{
                id: 'n1',
                expr: {
                  type: 'basic', field: 'value', operator: '>', value: 20,
                },
              }],
            },
          },
        }],
      },
      { actions: [{ name: 'clearFilter', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Filter value > 20');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiOption('filterValue')).toEqual(['value', '>', 20]);

    await typeText(aiChat.getInput(), 'Clear filter');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessage(1).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiOption('filterValue')).toBeNull();
  });

  test('Sort, group, page combined across three prompts should all succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `Name ${i % 5}`,
        value: (i + 1) * 10,
      })),
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      paging: { pageSize: 10 },
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
      { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
      { actions: [{ name: 'pageIndex', args: { pageIndex: 1 } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');

    await typeText(aiChat.getInput(), 'Group by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(2);
    await expect(aiChat.getAIMessage(1).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'groupIndex')).toBe(0);

    await typeText(aiChat.getInput(), 'Go to page 2');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(3);
    await expect(aiChat.getAIMessage(2).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiOption('paging.pageIndex')).toBe(1);
  });

  test('Sort should succeed with no rows', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    await expect(dataGrid.getDataRows()).toHaveCount(0);
  });

  test('Filter on empty grid should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      {
        actions: [{
          name: 'filterValue',
          args: {
            expression: {
              rootId: 'n1',
              nodes: [{
                id: 'n1',
                expr: {
                  type: 'basic', field: 'value', operator: '>', value: 10,
                },
              }],
            },
          },
        }],
      },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Filter value > 10');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiOption('filterValue')).toEqual(['value', '>', 10]);
    await expect(dataGrid.getDataRows()).toHaveCount(0);
  });

  test('SelectAll on empty grid should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      selection: { mode: 'multiple' },
    }, [
      { actions: [{ name: 'selectAll', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Select all');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(async () => (await dataGrid.apiOption('selectedRowKeys'))?.length).toBe(0);
  });

  test('Sort on single-row grid should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [{ id: 1, name: 'Alice', value: 30 }],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
    await expect(dataGrid.getDataCell(0, 1).element).toHaveText('Alice');
  });

  test('selectByIndexes [1] on single-row grid should select the row', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [{ id: 1, name: 'Alice', value: 30 }],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      selection: { mode: 'multiple' },
    }, [
      { actions: [{ name: 'selectionByIndexes', args: { indexes: [1], mode: 'select', scope: 'allPages' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Select first row');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await dataGrid.getDataRow(0).expectSelected();
  });

  test('selectByIndexes [5] out of range on single-row grid should not crash', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [{ id: 1, name: 'Alice', value: 30 }],
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      selection: { mode: 'multiple' },
    }, [
      { actions: [{ name: 'selectionByIndexes', args: { indexes: [5], mode: 'select', scope: 'allPages' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Select row 5');
    await page.keyboard.press('Enter');

    await expect(aiChat.getErrorMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getErrorActionItems()).toHaveCount(1);

    await dataGrid.getDataRow(0).expectSelected(false);
  });

  test('Page navigation on large dataset should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Name ${i + 1}`,
        value: (i + 1) * 10,
      })),
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      paging: { pageSize: 10 },
    }, [
      { actions: [{ name: 'pageIndex', args: { pageIndex: 99 } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Go to page 100');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiOption('paging.pageIndex')).toBe(99);
  });

  test('Grouping on large dataset should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        name: `Group ${i % 10}`,
        value: (i + 1) * 10,
      })),
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      paging: { pageSize: 20 },
    }, [
      { actions: [{ name: 'grouping', args: { dataField: 'name', groupIndex: 0 } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Group by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'groupIndex')).toBe(0);
  });

  test('Page size change on large dataset should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        name: `Name ${i + 1}`,
        value: (i + 1) * 10,
      })),
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      paging: { pageSize: 10 },
    }, [
      { actions: [{ name: 'pageSize', args: { pageSize: 200 } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Show 200 rows per page');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiOption('paging.pageSize')).toBe(200);
  });

  test('Sort on single-column grid should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [
        { name: 'Charlie' },
        { name: 'Alice' },
        { name: 'Bob' },
      ],
      columns: ['name'],
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Reorder on single-column grid should succeed without crash', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [
        { name: 'Alice' },
        { name: 'Bob' },
      ],
      columns: ['name'],
      showBorders: true,
      allowColumnReordering: true,
    }, [
      { actions: [{ name: 'columnsReorder', args: { dataField: 'name', visibleIndex: 0 } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Reorder columns');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'visibleIndex')).toBe(0);
  });

  test('Hide the only column should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: [
        { name: 'Alice' },
        { name: 'Bob' },
      ],
      columns: ['name'],
      showBorders: true,
      columnChooser: { enabled: true },
    }, [
      { actions: [{ name: 'columnsVisibility', args: { dataField: 'name', visible: false } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Hide name column');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'visible')).toBe(false);
  });

  test('Show column from all-hidden state should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: allHiddenColumns,
      showBorders: true,
      columnChooser: { enabled: true },
    }, [
      { actions: [{ name: 'columnsVisibility', args: { dataField: 'name', visible: true } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Show name column');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'visible')).toBe(true);
    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('Alice');
  });

  test('Sort while all columns hidden should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: allHiddenColumns,
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('Filter while all columns hidden should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: allHiddenColumns,
      showBorders: true,
    }, [
      {
        actions: [{
          name: 'filterValue',
          args: {
            expression: {
              rootId: 'n1',
              nodes: [{
                id: 'n1',
                expr: {
                  type: 'basic', field: 'value', operator: '>', value: 10,
                },
              }],
            },
          },
        }],
      },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Filter value > 10');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiOption('filterValue')).toEqual(['value', '>', 10]);
  });

  test('Sort by X when already sorted by X should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'name', sortOrder: 'asc' },
        { dataField: 'value' },
      ],
      showBorders: true,
    }, [
      { actions: [{ name: 'sorting', args: { dataField: 'name', sortOrder: 'asc' } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Sort by name asc');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBe('asc');
  });

  test('clearSorting when no sort should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'clearSorting', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Clear sorting');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiColumnOption('name', 'sortOrder')).toBeUndefined();
  });

  test('clearFilter when no filter should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
    }, [
      { actions: [{ name: 'clearFilter', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Clear filter');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);
    await expect.poll(() => dataGrid.apiOption('filterValue')).toBeNull();
    await expect(dataGrid.getDataRows()).toHaveCount(2);
  });

  test('clearSelection when no selection should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      selection: { mode: 'multiple' },
    }, [
      { actions: [{ name: 'clearSelection', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Clear selection');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(async () => (await dataGrid.apiOption('selectedRowKeys'))?.length).toBe(0);
  });

  test('deselectAll when nothing selected should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: ['id', 'name', 'value'],
      showBorders: true,
      selection: { mode: 'multiple' },
    }, [
      { actions: [{ name: 'deselectAll', args: {} }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Deselect all');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(async () => (await dataGrid.apiOption('selectedRowKeys'))?.length).toBe(0);
  });

  test('Hide already-hidden column should succeed', async ({ page }) => {
    await createGridWithAIAssistant(page, {
      dataSource: twoRows,
      keyExpr: 'id',
      columns: [
        { dataField: 'id' },
        { dataField: 'name' },
        { dataField: 'value', visible: false },
      ],
      showBorders: true,
      columnChooser: { enabled: true },
    }, [
      { actions: [{ name: 'columnsVisibility', args: { dataField: 'value', visible: false } }] },
    ]);

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await dataGrid.getAIAssistantButton().click();

    const aiChat = dataGrid.getAIAssistantChat();

    await typeText(aiChat.getInput(), 'Hide value column');
    await page.keyboard.press('Enter');

    await expect(aiChat.getSuccessMessages()).toHaveCount(1);
    await expect(aiChat.getAIMessage(0).getSuccessActionItems()).toHaveCount(1);

    await expect.poll(() => dataGrid.apiColumnOption('value', 'visible')).toBe(false);
  });
});
