import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import { changeTheme } from '../../../../helpers/testPageUtils';
import DataGrid from '../../../../models/dataGrid';
import { makeRowsViewTemplatesAsync } from '../../helpers/asyncTemplates';
import { getData } from '../../helpers/generateDataSourceData';

const makeLocalStorageJsonInvalid = (page: Page): Promise<void> => page.evaluate(() => {
  window.localStorage.testStorageKey = '{]';
});

const dataGridConfig = (): Properties => ({
  dataSource: [
    { id: 0, text: 'item 1' },
    { id: 1, text: 'item 2' },
    { id: 2, text: 'item 3' },
    { id: 3, text: 'item 4' },
  ],
  columnFixing: {
    enabled: true,
  },
  keyExpr: 'id',
  stateStoring: {
    enabled: true,
  },
  scrolling: {
    mode: 'virtual',
  },
  customizeColumns(columns) {
    /* eslint-disable no-param-reassign */
    columns[0].fixed = true;
    columns[0].fixedPosition = 'sticky';
    /* eslint-enable no-param-reassign */
  },
});

test.describe('State Storing', () => {
  test('The Grid should load if JSON in localStorage is invalid and stateStoring enabled', async ({ page }) => {
    const consoleWarnings: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'warning') {
        consoleWarnings.push(message.text());
      }
    });

    await makeLocalStorageJsonInvalid(page);
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { A: 1, B: 2, C: 3 },
        { A: 4, B: 5, C: 6 },
        { A: 7, B: 8, C: 9 },
      ],
      stateStoring: {
        enabled: true,
        storageKey: 'testStorageKey',
      },
    });

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const secondCell = dataGrid.getDataCell(1, 1);

    await expect(secondCell.element).toHaveText('5', { useInnerText: true });
    const isWarningExist = !!consoleWarnings.find((message) => message.startsWith('W1022'));
    expect(isWarningExist).toBe(true);
  });

  // T1188828
  test('The rows should render correctly when cellTemplates are used and the selectedRowKeys array contains an invalid key', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', (data): Properties => ({
      height: 800,
      renderAsync: false,
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
      dataSource: data,
      columns: [
        {
          dataField: 'field_0',
          cellTemplate: (_, { value }) => ($('<div/>') as any).text(value),
        },
      ],
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad: () => Promise.resolve({
          selectedRowKeys: ['key-invalid'],
        }),
      },
      paging: { pageSize: 50 },
      scrolling: {
        rowRenderingMode: 'virtual',
      },
    }), DEFAULT_SELECTOR, { arg: getData(1000, 1) });

    // simulating async rendering in React
    await makeRowsViewTemplatesAsync(page, DEFAULT_SELECTOR);

    // arrange
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await testScreenshot(page, 'T1188828-state-storing-with-selected-row-keys.png', { element: dataGrid.element });
  });

  test('The focused state of a row with the 0 key should be restored (T1252962)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { id: 0, text: 'item 1' },
        { id: 1, text: 'item 2' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad() {
          return Promise.resolve({
            focusedRowKey: 0,
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const dataRow0 = dataGrid.getDataRow(0);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await dataRow0.expectFocusedRow();
  });

  test('DataGrid - Cannot read properties of undefined (reading \'done\') error occurs when column fixing and state storing are used (T1283168)', async ({ page, theme }) => {
    await createWidget(page, 'dxDataGrid', dataGridConfig);

    await page.reload();
    await page.waitForFunction(() => !!(window as any).DevExpress);
    // A reload drops the theme the fixture applied.
    await changeTheme(page, theme);
    await createWidget(page, 'dxDataGrid', dataGridConfig);
    // eslint-disable-next-line @stylistic/max-len
    // DataGrid is expected to load normally with the given configuration, so no other checks are required.
  });

  test('DataGrid - The filterType property is reset if client state storing contains no filtering settings (T1296608)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [
        { id: 0, textID: '0', text: 'item 0' },
        { id: 1, textID: '1', text: 'item 1' },
      ],
      keyExpr: 'id',
      filterSyncEnabled: true,
      columns: [
        {
          dataField: 'id',
          caption: 'ID',
          dataType: 'string',
        },
        {
          dataField: 'textID',
          filterType: 'exclude',
          name: 'textID',
          dataType: 'string',
          filterValues: ['0'],
        },
      ],
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad() {
          return Promise.resolve({
            columns: [
              {
                dataField: 'id',
              },
              {
                dataField: 'textID',
              },
            ],
          });
        },
      },
    }));

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(dataGrid.getDataCell(0, 0).element).toHaveText('1', { useInnerText: true });
  });

  test('A column added at runtime should not be duplicated on state restore when it is declared in the columns array (T1336036)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => ({
      dataSource: [{ id: 1, name: 'a' }],
      keyExpr: 'id',
      columns: ['id', 'name'],
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad() {
          return Promise.resolve({
            columns: [
              { dataField: 'id' },
              { dataField: 'name', added: 'name' },
            ],
          });
        },
      },
    }));

    // arrange, act
    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    const headerRow = dataGrid.getHeaders().getHeaderRow(0);

    // assert
    await expect.poll(() => dataGrid.isReady()).toBe(true);
    await expect(headerRow.getHeaderCells()).toHaveCount(2);
    await expect(headerRow.getHeaderCell(0).element).toHaveText('Id');
    await expect(headerRow.getHeaderCell(1).element).toHaveText('Name');
  });
});
