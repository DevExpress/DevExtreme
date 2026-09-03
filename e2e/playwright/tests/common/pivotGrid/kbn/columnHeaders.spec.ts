import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { blurActiveElement } from '../../../../helpers/domUtils';
import PivotGrid from '../../../../models/pivotGrid';
import { sales } from '../data';

const PIVOT_GRID_SELECTOR = '#container';
const COLUMN_HEADERS_CELL_SELECTOR = 'thead.dx-pivotgrid-horizontal-headers td';

const createConfig = (): any => ({
  width: 800,
  allowExpandAll: true,
  fieldChooser: {
    enabled: false,
  },
  dataSource: {
    fields: [{
      dataField: 'region',
      area: 'column',
      expanded: true,
    }, {
      dataField: 'country',
      area: 'column',
    }, {
      dataField: 'city',
      area: 'row',
    }, {
      dataField: 'amount',
      area: 'data',
      summaryType: 'sum',
      dataType: 'number',
    }],
    store: sales,
  },
});

test('Column header cells should form a single tab stop', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await expect(
    page.locator(`${COLUMN_HEADERS_CELL_SELECTOR}[tabindex="0"]`),
    'only one column header cell is in the tab order',
  ).toHaveCount(1);

  await blurActiveElement(page);

  await page.keyboard.press('Tab');

  await expect(columnsArea.getCell(0, 0), 'first column header cell is focused by Tab').toBeFocused();

  await expect(
    page.locator(`${COLUMN_HEADERS_CELL_SELECTOR} .dx-expand-icon-container[tabindex="0"]`),
    'expand icons of column header cells are not in the tab order',
  ).toHaveCount(0);
});

test('ArrowLeft and ArrowRight should move focus between cells in a level', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await columnsArea.getCell(1, 0).click();

  await expect(columnsArea.getCell(1, 0), 'first cell of the second level is focused after click').toBeFocused();

  await page.keyboard.press('ArrowRight');

  await expect(columnsArea.getCell(1, 1), 'next cell in the level is focused after ArrowRight').toBeFocused();

  await page.keyboard.press('ArrowLeft');

  await expect(columnsArea.getCell(1, 0), 'previous cell in the level is focused after ArrowLeft').toBeFocused();
});

test('ArrowUp and ArrowDown should move focus between header levels', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await columnsArea.getCell(1, 0).click();

  await page.keyboard.press('ArrowUp');

  await expect(columnsArea.getCell(0, 0), 'parent level cell is focused after ArrowUp').toBeFocused();

  await page.keyboard.press('ArrowDown');

  await expect(columnsArea.getCell(1, 0), 'child level cell is focused after ArrowDown').toBeFocused();
});

test('Roving tabindex should follow the focused cell', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await columnsArea.getCell(1, 1).click();

  await expect(columnsArea.getCell(1, 1), 'focused cell is in the tab order').toHaveAttribute('tabindex', '0');

  await expect(
    page.locator(`${COLUMN_HEADERS_CELL_SELECTOR}[tabindex="0"]`),
    'the focused cell is the only tab stop',
  ).toHaveCount(1);

  await expect(columnsArea.getCell(0, 0), 'the first cell is removed from the tab order').toHaveAttribute('tabindex', '-1');
});

test('Focus should be preserved after expand and collapse by Enter', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', createConfig());

  const pivotGrid = new PivotGrid(page, PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await blurActiveElement(page);

  await page.keyboard.press('Tab');

  await expect(columnsArea.getCell(0, 0), 'expandable cell is focused').toBeFocused();

  const firstCellText = (await columnsArea.getCell(0, 0).textContent())?.trim();

  await page.keyboard.press('Enter');

  await expect(page.locator(':focus'), 'focus stays on the collapsed item control').toHaveAttribute('aria-label', firstCellText!);

  await page.keyboard.press('Enter');

  await expect(page.locator(':focus'), 'focus stays on the expanded item control').toHaveAttribute('aria-label', firstCellText!);
});

test('Focused cell should stay in view with virtual scrolling', async ({ page }) => {
  await createWidget(page, 'dxPivotGrid', {
    ...createConfig(),
    width: 300,
    height: 300,
    scrolling: {
      mode: 'virtual',
    },
    dataSource: {
      fields: [{
        dataField: 'region',
        area: 'column',
        expanded: true,
      }, {
        dataField: 'country',
        area: 'column',
        expanded: true,
      }, {
        dataField: 'city',
        area: 'column',
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'row',
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

  for (let i = 0; i < 8; i += 1) {
    await page.keyboard.press('ArrowRight');
  }

  const focusedCell = page.locator(`${COLUMN_HEADERS_CELL_SELECTOR}:focus`);

  await expect(focusedCell, 'a column header cell is focused after arrow navigation').toHaveCount(1);
  await expect(focusedCell, 'the focused cell is visible').toBeVisible();

  expect(
    await pivotGrid.getColumnsAreaScrollLeft(),
    'the column headers area is scrolled to the focused cell',
  ).toBeGreaterThan(0);
});
