import { ClientFunction, Selector } from 'testcafe';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import type { Properties } from 'devextreme/ui/data_grid';

fixture`Fixed columns tests with axe`
  .page(url(__dirname, '../../container.html'));

const pressKey = async (t: TestController, key: string, times = 1) => {
  for (let i = 0; i < times; i += 1) {
    await t.pressKey(key);
  }
};

const getGridConfig = (needFixedColumnOnLeft = true): Properties => ({
  columnWidth: 150,
  width: 800,
  keyExpr: 'id',
  scrolling: {
    useNative: true,
  },
  dataSource: [
    {
      id: 0, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
    },
    {
      id: 1, column1: 'a', column2: 'a', column3: 'a', column4: 'a', column5: 'a', column6: 'a', column7: 'a', column8: 'a',
    },
  ],
  columns: [
    { dataField: 'column1', fixed: needFixedColumnOnLeft },
    { dataField: 'column2', fixed: needFixedColumnOnLeft },
    { dataField: 'column3' },
    { dataField: 'column4' },
    { dataField: 'column5' },
    { dataField: 'column6' },
    { dataField: 'column7', fixed: true, fixedPosition: 'right' },
    { dataField: 'column8', fixed: true, fixedPosition: 'right' },
  ],
});

const COLUMNS_LENGTH = 8;

test('Accessibility: Scrollable should have focusable element', async (t) => {
  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', getGridConfig()));

test('Accessibility: Scrollable should have focusable element when navigate through fixed columns', async (t) => {
  const dataGrid = new DataGrid('#container');

  const columnsByFixing = await ClientFunction(
    () => (window as any).widget.getVisibleColumns().map((column) => column.fixed),
  )();

  // focus through headers
  await pressKey(t, 'tab', COLUMNS_LENGTH);

  // focus cells in first row
  for (let columnIndex = 0; columnIndex < COLUMNS_LENGTH; columnIndex += 1) {
    await pressKey(t, 'tab');

    const isFixedCell = columnsByFixing[columnIndex];
    const cell = isFixedCell
      ? dataGrid.getFixedDataCell(0, columnIndex)
      : dataGrid.getDataCell(0, columnIndex);

    await t
      .expect(cell.isFocused)
      .ok();

    // it makes sense to check accessibility only if fixed column is focused
    const needCheckA11y = columnsByFixing[columnIndex];

    if (needCheckA11y) {
      await a11yCheck(t);
    }
  }
}).before(async () => createWidget('dxDataGrid', getGridConfig()));

test('Accessibility: Scrollable should always have focusable element when navigate back to column headers', async (t) => {
  const dataGrid = new DataGrid('#container');

  // focus first cell in second row
  await a11yCheck(t);
  await t.click(dataGrid.getFixedDataCell(1, 0).element);

  await t
    .expect(dataGrid.getFixedDataCell(1, 0).element.focused)
    .ok();

  await a11yCheck(t);

  // focus last not fixed header cell
  await pressKey(t, 'shift+tab', 9);

  const headerCell = dataGrid.getHeaders().getHeaderRow(0).getHeaderCell(COLUMNS_LENGTH - 3);

  await t
    .expect(headerCell.isFocused)
    .ok();

  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', getGridConfig()));

test('Accessibility: Scrollable should have focusable element when click out of the grid', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getFixedDataCell(0, 0).element);

  // focus through data row to last cell
  await pressKey(t, 'tab', COLUMNS_LENGTH - 1);

  await t
    .expect(dataGrid.getFixedDataCell(0, COLUMNS_LENGTH - 1).isFocused)
    .ok();

  // focus out rows view by outside click
  const dataGridOffsetBottom = await dataGrid.element.getBoundingClientRectProperty('bottom');
  await t
    .click(Selector('body'), {
      offsetY: dataGridOffsetBottom + 10,
    });

  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', getGridConfig()));

test('Accessibility: Scrollable should have focusable element when navigate out of the grid', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t.click(dataGrid.getFixedDataCell(0, 0).element);

  // focus through 1st and 2nd data row
  await pressKey(t, 'tab', COLUMNS_LENGTH - 1);
  await pressKey(t, 'tab', COLUMNS_LENGTH);

  // focus button outside of the grid
  await pressKey(t, 'tab');

  await t
    .expect(Selector('#myButton').focused)
    .ok();

  await a11yCheck(t);
}).before(async () => {
  await ClientFunction(() => { $('<div id="myButton">').appendTo('body'); })();
  await createWidget('dxButton', { text: 'Focus' }, '#myButton');

  await createWidget('dxDataGrid', getGridConfig());
});

test('Accessibility: Scrollable should have focusable when fixed on the right side columns are focused', async (t) => {
  const dataGrid = new DataGrid('#container');

  // focus through headers
  await pressKey(t, 'tab', COLUMNS_LENGTH);

  // focus through data row till last cell (which is fixed)
  await pressKey(t, 'tab', COLUMNS_LENGTH);

  await t
    .expect(dataGrid.getFixedDataCell(0, COLUMNS_LENGTH - 1).isFocused)
    .ok();

  await a11yCheck(t);
}).before(async () => createWidget('dxDataGrid', getGridConfig(false)));
