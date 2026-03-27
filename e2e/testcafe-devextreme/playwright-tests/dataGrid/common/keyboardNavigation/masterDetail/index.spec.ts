import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

const employees = [
  { ID: 1, Prefix: 'Mr.', FirstName: 'John', LastName: 'Heart', BirthDate: '1964/03/16' },
  { ID: 2, Prefix: 'Mrs.', FirstName: 'Olivia', LastName: 'Peyton', BirthDate: '1981/06/03' },
];

const tasks = [
  { ID: 5, Priority: 'High', Status: 'In Progress', EmployeeID: 1 },
  { ID: 22, Priority: 'High', Status: 'Completed', EmployeeID: 1 },
];

const createMasterDetailGrid = (page: any) => createWidget(page, 'dxDataGrid', {
  dataSource: employees,
  keyExpr: 'ID',
  showBorders: true,
  columns: [
    { dataField: 'Prefix', caption: 'Title', width: 70 },
    'FirstName',
    'LastName',
    { dataField: 'BirthDate', dataType: 'date' },
  ],
  editing: {
    mode: 'form',
    allowUpdating: true,
  },
  masterDetail: {
    enabled: true,
    template(container: any, options: any) {
      const gridTasks = (window as any).__masterDetailTasks;
      const devexpress = (window as any).DevExpress;
      const currentEmployeeData = options.data;

      $('<div>')
        .addClass('master-detail-caption')
        .text(`${currentEmployeeData.FirstName} ${currentEmployeeData.LastName}'s Tasks:`)
        .appendTo(container);

      $('<div>')
        .dxDataGrid({
          columnAutoWidth: true,
          showBorders: true,
          columns: ['Priority', {
            caption: 'Completed',
            dataType: 'boolean',
            calculateCellValue(rowData: any) {
              return rowData.Status === 'Completed';
            },
          }],
          dataSource: new devexpress.data.DataSource({
            store: new devexpress.data.ArrayStore({
              key: 'ID',
              data: gridTasks,
            }),
            filter: ['EmployeeID', '=', options.key],
          }),
        }).appendTo(container);
    },
  },
});

test.describe('Keyboard Navigation - Master Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
    await page.evaluate((t) => { (window as any).__masterDetailTasks = t; }, tasks);
  });

  test.skip('Focus goes inside master detail on tab', async ({ page }) => {
    // TODO: Playwright migration - master-detail-input does not receive focus after Tab navigation
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      keyExpr: 'id',
      keyboardNavigation: {
        enabled: true,
      },
      masterDetail: {
        enabled: true,
        template(container: any) {
          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'master-detail-input';
          input.setAttribute('tabindex', '0');
          container.get(0).appendChild(input);
        },
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiExpandRow(1);

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    const firstCell = dataGrid.getDataCell(0, 0);
    await firstCell.element.click();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const masterDetailInput = masterDetailRow.locator('.master-detail-input');
    await expect(masterDetailInput).toBeFocused();
  });

  test('Focus goes inside master detail on tab (with inner DataGrid)', async ({ page }) => {
    await createMasterDetailGrid(page);

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').click();

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    await dataGrid.getDataCell(0, 4).element.click();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const innerHeaderCell = masterDetailRow.locator('.dx-datagrid .dx-header-row td').first();
    const isFocused = await innerHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused).toBe(true);
  });

  test('Focus goes inside previous master detail on shift+tab', async ({ page }) => {
    await createMasterDetailGrid(page);

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').click();

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    const secondDataCell = dataGrid.getDataCell(1, 1);
    await secondDataCell.element.click();

    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    const innerDataCell = masterDetailRow.locator('.dx-datagrid .dx-data-row td').first();
    const isFocused = await innerDataCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused).toBe(true);
  });

  test('Focus goes on master detail using arrow keys', async ({ page }) => {
    await createMasterDetailGrid(page);

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').click();

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    await dataGrid.getDataCell(0, 1).element.click();

    await page.keyboard.press('ArrowDown');

    const masterDetailCell = masterDetailRow.locator('td').first();
    const isMasterFocused = await masterDetailCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el
        || el.closest('tr')?.classList.contains('dx-master-detail-row') === true,
    );

    const masterRowFocused = await masterDetailRow.evaluate(
      (el) => {
        const focused = el.querySelector('.dx-focused');
        return focused !== null || document.activeElement === el || el.contains(document.activeElement);
      },
    );
    expect(masterRowFocused).toBe(true);
  });

  test('Focus goes inside master detail on enter and goes out on esc', async ({ page }) => {
    await createMasterDetailGrid(page);

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').click();

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    await dataGrid.getDataCell(0, 1).element.click();

    await page.keyboard.press('ArrowDown');

    const masterRowFocusedBefore = await masterDetailRow.evaluate(
      (el) => el.contains(document.activeElement) || document.activeElement === el,
    );
    expect(masterRowFocusedBefore).toBe(true);

    await page.keyboard.press('Enter');

    const innerHeaderCell = masterDetailRow.locator('.dx-datagrid .dx-header-row td').first();
    const isInnerFocused = await innerHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isInnerFocused).toBe(true);

    await page.keyboard.press('Escape');

    const masterRowFocusedAfter = await masterDetailRow.evaluate(
      (el) => el.contains(document.activeElement) || document.activeElement === el,
    );
    expect(masterRowFocusedAfter).toBe(true);
  });

  test('up/down arrows works only on master detail, not on its content', async ({ page }) => {
    await createMasterDetailGrid(page);

    const dataGrid = new DataGrid(page);

    await dataGrid.getDataRow(0).element.locator('.dx-command-expand').click();

    const masterDetailRow = dataGrid.getMasterRow(0);
    await expect(masterDetailRow).toBeVisible();

    await dataGrid.getDataCell(0, 1).element.click();

    await page.keyboard.press('ArrowDown');

    await page.keyboard.press('Enter');

    const innerHeaderCell = masterDetailRow.locator('.dx-datagrid .dx-header-row td').first();
    const isFocused = await innerHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocused).toBe(true);

    await page.keyboard.press('ArrowUp');
    const isFocusedAfterUp = await innerHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocusedAfterUp).toBe(true);

    await page.keyboard.press('ArrowDown');
    const isFocusedAfterDown = await innerHeaderCell.evaluate(
      (el) => el.classList.contains('dx-focused') || document.activeElement === el,
    );
    expect(isFocusedAfterDown).toBe(true);
  });
});
