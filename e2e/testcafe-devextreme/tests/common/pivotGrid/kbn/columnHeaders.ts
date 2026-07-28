import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { ClientFunction, Selector } from 'testcafe';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { sales } from '../data';

fixture.disablePageReloads`pivotGrid_kbn_columnHeaders`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';
const COLUMN_HEADERS_CELL_SELECTOR = 'thead.dx-pivotgrid-horizontal-headers td';

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

test('Column header cells should form a single tab stop', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await t
    .expect(Selector(`${COLUMN_HEADERS_CELL_SELECTOR}[tabindex="0"]`).count)
    .eql(1, 'only one column header cell is in the tab order');

  await blurActiveElement();

  await t
    .pressKey('tab')
    .expect(columnsArea.getCell(0, 0).focused)
    .ok('first column header cell is focused by Tab');

  await t
    .expect(Selector(`${COLUMN_HEADERS_CELL_SELECTOR} .dx-expand-icon-container[tabindex="0"]`).count)
    .eql(0, 'expand icons of column header cells are not in the tab order');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('ArrowLeft and ArrowRight should move focus between cells in a level', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await t
    .click(columnsArea.getCell(1, 0))
    .expect(columnsArea.getCell(1, 0).focused)
    .ok('first cell of the second level is focused after click');

  await t
    .pressKey('right')
    .expect(columnsArea.getCell(1, 1).focused)
    .ok('next cell in the level is focused after ArrowRight');

  await t
    .pressKey('left')
    .expect(columnsArea.getCell(1, 0).focused)
    .ok('previous cell in the level is focused after ArrowLeft');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('ArrowUp and ArrowDown should move focus between header levels', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await t
    .click(columnsArea.getCell(1, 0));

  await t
    .pressKey('up')
    .expect(columnsArea.getCell(0, 0).focused)
    .ok('parent level cell is focused after ArrowUp');

  await t
    .pressKey('down')
    .expect(columnsArea.getCell(1, 0).focused)
    .ok('child level cell is focused after ArrowDown');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Roving tabindex should follow the focused cell', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await t
    .click(columnsArea.getCell(1, 1))
    .expect(columnsArea.getCell(1, 1).getAttribute('tabindex'))
    .eql('0', 'focused cell is in the tab order');

  await t
    .expect(Selector(`${COLUMN_HEADERS_CELL_SELECTOR}[tabindex="0"]`).count)
    .eql(1, 'the focused cell is the only tab stop');

  await t
    .expect(columnsArea.getCell(0, 0).getAttribute('tabindex'))
    .eql('-1', 'the first cell is removed from the tab order');
}).before(async () => createWidget('dxPivotGrid', createConfig()));

test('Focus should be preserved after expand and collapse by Enter', async (t) => {
  const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
  const columnsArea = pivotGrid.getColumnsArea();

  await blurActiveElement();

  await t
    .pressKey('tab')
    .expect(columnsArea.getCell(0, 0).focused)
    .ok('expandable cell is focused');

  const firstCellText = (await columnsArea.getCell(0, 0).textContent).trim();

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
  const getColumnsScrollLeft = ClientFunction(
    // eslint-disable-next-line no-underscore-dangle
    () => (getInstance() as any)._columnsArea._getScrollable().scrollLeft(),
    { dependencies: { getInstance } },
  );

  await blurActiveElement();

  await t.pressKey('tab');

  for (let i = 0; i < 8; i += 1) {
    await t.pressKey('right');
  }

  const focusedCell = Selector(`${COLUMN_HEADERS_CELL_SELECTOR}`).filter((node) => node === document.activeElement);

  await t
    .expect(focusedCell.count)
    .eql(1, 'a column header cell is focused after arrow navigation')
    .expect(focusedCell.visible)
    .ok('the focused cell is visible')
    .expect(getColumnsScrollLeft())
    .gt(0, 'the column headers area is scrolled to the focused cell');
}).before(async () => createWidget('dxPivotGrid', {
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
}));
