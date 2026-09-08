import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { blurActiveElement } from '../../../../helpers/domUtils';
import PivotGrid from '../../../../models/pivotGrid';
import { sales } from '../data';

const PIVOT_GRID_SELECTOR = '#container';
const CONTEXT_MENU_SELECTOR = '.dx-context-menu.dx-overlay-content';
const MENU_ITEM_SELECTOR = `${CONTEXT_MENU_SELECTOR} .dx-menu-item`;
const ROW_HEADERS_CELL_SELECTOR = 'tbody.dx-pivotgrid-vertical-headers td';

// Chrome turns a real Shift+F10 into a "contextmenu" event of its own, which would open the menu
// even if the widget ignored the shortcut; the keydown is dispatched instead so the assertion is
// about the widget, the way the TestCafe test meant it.
const SHIFT_F10_KEYDOWN = {
  key: 'F10', code: 'F10', shiftKey: true, bubbles: true, cancelable: true,
};

const createConfig = (): any => ({
  width: 800,
  allowExpandAll: true,
  allowSortingBySummary: true,
  fieldChooser: {
    enabled: false,
  },
  dataSource: {
    fields: [{
      dataField: 'region',
      area: 'row',
      expanded: true,
    }, {
      dataField: 'city',
      area: 'row',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      dataField: 'amount',
      area: 'data',
      summaryType: 'sum',
      dataType: 'number',
    }],
    store: sales,
  },
});

test('Shift+F10 should open the context menu anchored to the focused row header cell', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();
  const cell = rowsArea.getCellByPosition(0, 0);

  await blurActiveElement(page);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await expect(cell, 'a row header cell is focused').toBeFocused();

  await cell.dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  const menu = page.locator(CONTEXT_MENU_SELECTOR);

  await expect(menu, 'the context menu is opened by Shift+F10').toBeVisible();
  await expect(menu, 'focus is moved into the menu').toBeFocused();
  await expect(
    page.locator(MENU_ITEM_SELECTOR).filter({ hasText: 'Expand All' }).first(),
    'the menu contains the header cell items',
  ).toBeAttached();

  const menuRect = await menu.boundingBox();
  const cellRect = await cell.boundingBox();

  expect(menuRect!.x, 'the menu is anchored to the cell horizontally')
    .toBeGreaterThanOrEqual(cellRect!.x - 1);
  expect(menuRect!.x, 'the menu is anchored to the cell horizontally')
    .toBeLessThanOrEqual(cellRect!.x + cellRect!.width);
  expect(menuRect!.y, 'the menu is anchored to the cell vertically')
    .toBeGreaterThanOrEqual(cellRect!.y - 1);
  expect(menuRect!.y, 'the menu is anchored to the cell vertically')
    .toBeLessThanOrEqual(cellRect!.y + cellRect!.height);
});

test('Shift+F10 should open the context menu for a column header cell', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    ...createConfig(),
    dataSource: {
      fields: [{
        caption: 'Region',
        dataField: 'region',
        area: 'row',
        allowSortingBySummary: true,
      }, {
        dataField: 'city',
        area: 'column',
      }, {
        dataField: 'amount',
        area: 'data',
        summaryType: 'sum',
        dataType: 'number',
      }],
      store: sales,
    },
  });

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await blurActiveElement(page);

  await page.keyboard.press('Tab');

  await expect(columnsArea.getCell(0, 0), 'a column header cell is focused').toBeFocused();

  await columnsArea.getCell(0, 0).dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  await expect(
    page.locator(CONTEXT_MENU_SELECTOR),
    'the context menu is opened by Shift+F10',
  ).toBeVisible();
  await expect(
    page.locator(MENU_ITEM_SELECTOR).filter({ hasText: 'Sort "Region" by This Column' }).first(),
    'the menu contains the sorting by summary items',
  ).toBeAttached();
});

test('Escape should close the menu and return focus to the originating cell', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();
  const cell = rowsArea.getCellByPosition(0, 0);

  await blurActiveElement(page);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await expect(cell, 'a row header cell is focused').toBeFocused();

  await cell.dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  await expect(
    page.locator(CONTEXT_MENU_SELECTOR),
    'the context menu is opened and focused',
  ).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(
    page.locator(CONTEXT_MENU_SELECTOR),
    'the context menu is closed by Escape',
  ).toBeHidden();
  await expect(cell, 'focus is returned to the originating cell').toBeFocused();
});

test('Menu items should be operable by keyboard and focus should return to the cell', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    ...createConfig(),
    dataSource: {
      fields: [{
        dataField: 'region',
        area: 'row',
      }, {
        dataField: 'city',
        area: 'row',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
      }, {
        dataField: 'amount',
        area: 'data',
        summaryType: 'sum',
        dataType: 'number',
      }],
      store: sales,
    },
  });

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();
  const rowHeaderCells = page.locator(ROW_HEADERS_CELL_SELECTOR);
  const initialRowsCount = await rowHeaderCells.count();

  await blurActiveElement(page);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await expect(rowsArea.getCellByPosition(0, 0), 'a row header cell is focused').toBeFocused();

  await rowsArea.getCellByPosition(0, 0).dispatchEvent('keydown', SHIFT_F10_KEYDOWN);

  await expect(
    page.locator(CONTEXT_MENU_SELECTOR),
    'the context menu is opened and focused',
  ).toBeFocused();

  await page.keyboard.press('ArrowDown');

  await expect(
    page.locator(MENU_ITEM_SELECTOR).filter({ hasText: 'Expand All' }).first(),
    'the first menu item is focused by ArrowDown',
  ).toHaveClass(/dx-state-focused/);

  await page.keyboard.press('Enter');

  await expect(
    page.locator(CONTEXT_MENU_SELECTOR),
    'the context menu is closed after the item is executed',
  ).toBeHidden();

  await expect
    .poll(async () => rowHeaderCells.count(), { message: 'Expand All is executed' })
    .toBeGreaterThan(initialRowsCount);

  await expect(
    page.locator(`${ROW_HEADERS_CELL_SELECTOR}:focus`),
    'focus is returned to the originating cell',
  ).toHaveCount(1);
});
