import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { ClientFunction, Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { sales } from '../data';

fixture.disablePageReloads`pivotGrid_kbn_rowHeaders`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';
const ROW_HEADERS_CELL_SELECTOR = 'tbody.dx-pivotgrid-vertical-headers td';

const blurActiveElement = ClientFunction(() => {
  const activeElement = document.activeElement as HTMLElement | null;
  activeElement?.blur();
});

const createConfig = () => ({
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

test('Row header cells should form a single tab stop', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await t
    .expect(Selector(`${ROW_HEADERS_CELL_SELECTOR}[tabindex="0"]`).count)
    .eql(1, 'only one row header cell is in the tab order');

  await blurActiveElement();

  await t
    .pressKey('tab tab')
    .expect(rowsArea.getCellByPosition(0, 0).focused)
    .ok('first row header cell is focused by Tab');

  await t
    .expect(Selector(`${ROW_HEADERS_CELL_SELECTOR} .dx-expand-icon-container[tabindex="0"]`).count)
    .eql(0, 'expand icons of row header cells are not in the tab order');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('ArrowUp and ArrowDown should move focus between rows', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await t
    .click(rowsArea.getCellByPosition(0, 1))
    .expect(rowsArea.getCellByPosition(0, 1).focused)
    .ok('first city cell is focused after click');

  await t
    .pressKey('down')
    .expect(rowsArea.getCellByPosition(1, 0).focused)
    .ok('city cell in the next row is focused after ArrowDown');

  await t
    .pressKey('up')
    .expect(rowsArea.getCellByPosition(0, 1).focused)
    .ok('city cell in the previous row is focused after ArrowUp');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('ArrowLeft and ArrowRight should move focus between row header levels', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await t
    .click(rowsArea.getCellByPosition(0, 1));

  await t
    .pressKey('left')
    .expect(rowsArea.getCellByPosition(0, 0).focused)
    .ok('parent level cell is focused after ArrowLeft');

  await t
    .pressKey('right')
    .expect(rowsArea.getCellByPosition(0, 1).focused)
    .ok('child level cell is focused after ArrowRight');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Roving tabindex should follow the focused cell', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await t
    .click(rowsArea.getCellByPosition(1, 0))
    .expect(rowsArea.getCellByPosition(1, 0).getAttribute('tabindex'))
    .eql('0', 'focused cell is in the tab order');

  await t
    .expect(Selector(`${ROW_HEADERS_CELL_SELECTOR}[tabindex="0"]`).count)
    .eql(1, 'the focused cell is the only tab stop');

  await t
    .expect(rowsArea.getCellByPosition(0, 0).getAttribute('tabindex'))
    .eql('-1', 'the first cell is removed from the tab order');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Focus should be preserved after expand and collapse by Enter', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const rowsArea = pivotGrid.getRowsArea();

  await blurActiveElement();

  await t
    .pressKey('tab tab')
    .expect(rowsArea.getCellByPosition(0, 0).focused)
    .ok('expandable cell is focused');

  const firstCellText = (await rowsArea.getCellByPosition(0, 0).textContent).trim();

  await t
    .pressKey('enter')
    .expect(Selector(':focus').getAttribute('aria-label'))
    .eql(firstCellText, 'focus stays on the collapsed item control');

  await t
    .pressKey('enter')
    .expect(Selector(':focus').getAttribute('aria-label'))
    .eql(firstCellText, 'focus stays on the expanded item control');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Focused cell should stay in view with virtual scrolling', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const { getInstance } = pivotGrid;
  const getRowsScrollTop = ClientFunction(
    // eslint-disable-next-line no-underscore-dangle
    () => (getInstance() as any)._rowsArea._getScrollable().scrollTop(),
    { dependencies: { getInstance } },
  );

  await blurActiveElement();

  await t.pressKey('tab tab');

  for (let i = 0; i < 8; i += 1) {
    await t.pressKey('down');
  }

  const focusedCell = Selector(ROW_HEADERS_CELL_SELECTOR)
    .filter((node) => node === document.activeElement);

  await t
    .expect(focusedCell.count)
    .eql(1, 'a row header cell is focused after arrow navigation')
    .expect(focusedCell.visible)
    .ok('the focused cell is visible')
    .expect(getRowsScrollTop())
    .gt(0, 'the row headers area is scrolled to the focused cell');
}).before(async () => createWidget('dxPivotGrid', {
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
}));
