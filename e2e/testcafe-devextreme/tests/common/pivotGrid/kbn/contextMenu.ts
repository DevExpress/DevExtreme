import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { ClientFunction, Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { sales } from '../data';

fixture.disablePageReloads`pivotGrid_kbn_contextMenu`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';
const CONTEXT_MENU_SELECTOR = '.dx-context-menu.dx-overlay-content';
const MENU_ITEM_SELECTOR = `${CONTEXT_MENU_SELECTOR} .dx-menu-item`;
const ROW_HEADERS_CELL_SELECTOR = 'tbody.dx-pivotgrid-vertical-headers td';

const blurActiveElement = ClientFunction(() => {
  const activeElement = document.activeElement as HTMLElement | null;
  activeElement?.blur();
});

const createConfig = () => ({
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

test('Shift+F10 should open the context menu anchored to the focused row header cell', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();
  const cell = rowsArea.getCellByPosition(0, 0);

  await blurActiveElement();

  await t
    .pressKey('tab tab')
    .expect(cell.focused)
    .ok('a row header cell is focused')
    .pressKey('shift+f10');

  const menu = Selector(CONTEXT_MENU_SELECTOR);

  await t
    .expect(menu.visible)
    .ok('the context menu is opened by Shift+F10')
    .expect(menu.focused)
    .ok('focus is moved into the menu')
    .expect(Selector(MENU_ITEM_SELECTOR).withText('Expand All').exists)
    .ok('the menu contains the header cell items');

  const menuRect = await menu.boundingClientRect;
  const cellRect = await cell.boundingClientRect;

  await t
    .expect(menuRect.left)
    .within((cellRect.left ?? 0) - 1, cellRect.right ?? 0, 'the menu is anchored to the cell horizontally')
    .expect(menuRect.top)
    .within((cellRect.top ?? 0) - 1, cellRect.bottom ?? 0, 'the menu is anchored to the cell vertically');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Shift+F10 should open the context menu for a column header cell', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await blurActiveElement();

  await t
    .pressKey('tab')
    .expect(columnsArea.getCell(0, 0).focused)
    .ok('a column header cell is focused')
    .pressKey('shift+f10');

  await t
    .expect(Selector(CONTEXT_MENU_SELECTOR).visible)
    .ok('the context menu is opened by Shift+F10')
    .expect(Selector(MENU_ITEM_SELECTOR).withText('Sort "Region" by This Column').exists)
    .ok('the menu contains the sorting by summary items');
}).before(async () => createWidget('dxPivotGrid', {
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
}));

test('Escape should close the menu and return focus to the originating cell', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();
  const cell = rowsArea.getCellByPosition(0, 0);

  await blurActiveElement();

  await t
    .pressKey('tab tab')
    .expect(cell.focused)
    .ok('a row header cell is focused')
    .pressKey('shift+f10')
    .expect(Selector(CONTEXT_MENU_SELECTOR).focused)
    .ok('the context menu is opened and focused');

  await t
    .pressKey('esc')
    .expect(Selector(CONTEXT_MENU_SELECTOR).visible)
    .notOk('the context menu is closed by Escape')
    .expect(cell.focused)
    .ok('focus is returned to the originating cell');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Menu items should be operable by keyboard and focus should return to the cell', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();
  const initialRowsCount = await Selector(ROW_HEADERS_CELL_SELECTOR).count;

  await blurActiveElement();

  await t
    .pressKey('tab tab')
    .expect(rowsArea.getCellByPosition(0, 0).focused)
    .ok('a row header cell is focused')
    .pressKey('shift+f10')
    .expect(Selector(CONTEXT_MENU_SELECTOR).focused)
    .ok('the context menu is opened and focused')
    .pressKey('down')
    .expect(Selector(MENU_ITEM_SELECTOR).withText('Expand All').hasClass('dx-state-focused'))
    .ok('the first menu item is focused by ArrowDown');

  await t
    .pressKey('enter')
    .expect(Selector(CONTEXT_MENU_SELECTOR).visible)
    .notOk('the context menu is closed after the item is executed')
    .expect(Selector(ROW_HEADERS_CELL_SELECTOR).count)
    .gt(initialRowsCount, 'Expand All is executed');

  const focusedCell = Selector(ROW_HEADERS_CELL_SELECTOR)
    .filter((node) => node === document.activeElement);

  await t
    .expect(focusedCell.count)
    .eql(1, 'focus is returned to the originating cell');
}).before(async () => createWidget('dxPivotGrid', {
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
}));
