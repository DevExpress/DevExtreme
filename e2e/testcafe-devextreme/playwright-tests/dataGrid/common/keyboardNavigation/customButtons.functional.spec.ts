import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const createDataGrid = (page: any) => createWidget(page, 'dxDataGrid', {
  dataSource: [
    { id: 1, columnA: 'A_0', columnB: 'B_0' },
    { id: 2, columnA: 'A_1', columnB: 'B_1' },
    { id: 3, columnA: 'A_2', columnB: 'B_2' },
  ],
  keyExpr: 'id',
  columns: [
    {
      type: 'buttons',
      buttons: [
        {
          hint: 'button_1',
          icon: 'edit',
          onClick: (e: any) => $(e.event.target).attr('has-been-clicked', 'true'),
        },
        {
          hint: 'button_2',
          icon: 'remove',
        },
      ],
    },
    'id',
    'columnA',
    'columnB',
  ],
  sorting: {
    mode: 'none',
  },
});

test.describe('Keyboard Navigation - custom buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Custom buttons cell should be focused before custom buttons on tab navigation', async ({ page }) => {
    // TODO: Playwright migration - dx-focused class not applied to buttons cell after Tab key press
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      keyExpr: 'id',
      keyboardNavigation: {
        enabled: true,
      },
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      columns: [
        'name',
        {
          type: 'buttons',
          buttons: [
            { name: 'edit', text: 'Edit' },
            { name: 'custom', text: 'Custom' },
          ],
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.focus();

    const firstCell = dataGrid.getDataCell(0, 0);
    await firstCell.element.click();

    await page.keyboard.press('Tab');

    const buttonsCell = dataGrid.getDataCell(0, 1);
    const isFocused = await buttonsCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test('Custom buttons cell should be focused before custom buttons on tab navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page);
    const expectedFocusedCell = dataGrid.getDataCell(0, 0);
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderCell(0, 3);

    await cellToStartNavigation.click();
    await page.keyboard.press('Tab');

    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test('Custom buttons cell should be focused after custom buttons on shift+tab reverse navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page);
    const expectedFocusedCell = dataGrid.getDataCell(0, 0);
    const cellToStartNavigation = dataGrid.getDataCell(0, 1);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');

    const isFocused = await expectedFocusedCell.element.evaluate(
      (el) => el.classList.contains('dx-focused'),
    );
    expect(isFocused).toBe(true);
  });

  test('First custom button inside custom buttons cell should be focused on tab navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page);
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderCell(0, 3);

    await cellToStartNavigation.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedEl = await page.evaluate(() => document.activeElement?.getAttribute('title'));
    expect(focusedEl).toBe('button_1');
  });

  test('Last custom button inside custom buttons cell should be focused on shift+tab reverse navigation', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page);
    const cellToStartNavigation = dataGrid.getDataCell(0, 1);

    await cellToStartNavigation.element.click();
    await page.keyboard.press('Shift+Tab');

    const focusedEl = await page.evaluate(() => document.activeElement?.getAttribute('title'));
    expect(focusedEl).toBe('button_2');
  });

  test('Custom button inside custom buttons cell should be clickable by pressing enter key', async ({ page }) => {
    await createDataGrid(page);

    const dataGrid = new DataGrid(page);
    const cellToStartNavigation = dataGrid.getHeaders().getHeaderCell(0, 3);

    await cellToStartNavigation.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const hasBeenClicked = await page.evaluate(
      () => !!$('[has-been-clicked="true"]').length,
    );
    expect(hasBeenClicked).toBe(true);
  });
});
