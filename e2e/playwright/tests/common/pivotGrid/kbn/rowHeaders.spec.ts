import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { blurActiveElement } from '../../../../helpers/domUtils';
import PivotGrid from '../../../../models/pivotGrid';
import { sales } from '../data';

const PIVOT_GRID_SELECTOR = '#container';
const ROW_HEADERS_CELL_SELECTOR = 'tbody.dx-pivotgrid-vertical-headers td';

const createConfig = (): any => ({
  width: 800,
  allowExpandAll: true,
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

test('Row header cells should form a single tab stop', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await expect(
    page.locator(`${ROW_HEADERS_CELL_SELECTOR}[tabindex="0"]`),
    'only one row header cell is in the tab order',
  ).toHaveCount(1);

  await blurActiveElement(page);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await expect(rowsArea.getCellByPosition(0, 0), 'first row header cell is focused by Tab').toBeFocused();

  await expect(
    page.locator(`${ROW_HEADERS_CELL_SELECTOR} .dx-expand-icon-container[tabindex="0"]`),
    'expand icons of row header cells are not in the tab order',
  ).toHaveCount(0);
});

test('ArrowUp and ArrowDown should move focus between rows', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await rowsArea.getCellByPosition(0, 1).click();

  await expect(rowsArea.getCellByPosition(0, 1), 'first city cell is focused after click').toBeFocused();

  await page.keyboard.press('ArrowDown');

  await expect(rowsArea.getCellByPosition(1, 0), 'city cell in the next row is focused after ArrowDown').toBeFocused();

  await page.keyboard.press('ArrowUp');

  await expect(rowsArea.getCellByPosition(0, 1), 'city cell in the previous row is focused after ArrowUp').toBeFocused();
});

test('ArrowLeft and ArrowRight should move focus between row header levels', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await rowsArea.getCellByPosition(0, 1).click();

  await page.keyboard.press('ArrowLeft');

  await expect(rowsArea.getCellByPosition(0, 0), 'parent level cell is focused after ArrowLeft').toBeFocused();

  await page.keyboard.press('ArrowRight');

  await expect(rowsArea.getCellByPosition(0, 1), 'child level cell is focused after ArrowRight').toBeFocused();
});

test('Roving tabindex should follow the focused cell', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await rowsArea.getCellByPosition(1, 0).click();

  await expect(rowsArea.getCellByPosition(1, 0), 'focused cell is in the tab order').toHaveAttribute('tabindex', '0');

  await expect(
    page.locator(`${ROW_HEADERS_CELL_SELECTOR}[tabindex="0"]`),
    'the focused cell is the only tab stop',
  ).toHaveCount(1);

  await expect(rowsArea.getCellByPosition(0, 0), 'the first cell is removed from the tab order').toHaveAttribute('tabindex', '-1');
});

test('Focus should be preserved after expand and collapse by Enter', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await blurActiveElement(page);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  await expect(rowsArea.getCellByPosition(0, 0), 'expandable cell is focused').toBeFocused();

  const firstCellText = (await rowsArea.getCellByPosition(0, 0).textContent())?.trim();

  await page.keyboard.press('Enter');

  await expect(page.locator(':focus'), 'focus stays on the collapsed item control').toHaveAttribute('aria-label', firstCellText!);

  await page.keyboard.press('Enter');

  await expect(page.locator(':focus'), 'focus stays on the expanded item control').toHaveAttribute('aria-label', firstCellText!);
});

test('Focused cell should stay in view with virtual scrolling', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    ...createConfig(),
    width: 400,
    height: 250,
    scrolling: {
      mode: 'virtual',
    },
    dataSource: {
      fields: [{
        dataField: 'region',
        area: 'row',
        expanded: true,
      }, {
        dataField: 'country',
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

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);

  await blurActiveElement(page);

  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('ArrowDown');
  }

  const focusedCell = page.locator(`${ROW_HEADERS_CELL_SELECTOR}:focus`);

  await expect(focusedCell, 'a row header cell is focused after arrow navigation').toHaveCount(1);
  await expect(focusedCell, 'the focused cell is visible').toBeVisible();

  expect(
    await pivotGrid.getRowsAreaScrollTop(),
    'the row headers area is scrolled to the focused cell',
  ).toBeGreaterThan(0);
});
