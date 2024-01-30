import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from '../../../model/dataGrid';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const DATA_GRID_SELECTOR = '#container';
// NOTE: Sometimes testcafe drag too fast.
// With 90% speed everything work stable on every run.
const DRAG_MOUSE_OPTS = { speed: 0.9 };
const HEADER_CELL_TEMPLATE_FUNC = ($container: any, { column: { caption } }) => {
  const $border = $('<div>');
  $border.css({
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    width: '2px',
    'background-color': '#f00',
  });
  $border.attr('e2e-header-border', 'true');

  $container.parent().css('position', 'relative');
  $container.append($('<div>').text(caption));
  $container.append($border);
};

// TODO Vinogradov: Change it to a general dispose widget helper function.
const disposeDataGrid = ClientFunction(() => {
  const dataGrid = ($(DATA_GRID_SELECTOR) as any).dxDataGrid('instance');

  dataGrid?.dispose();
}, { dependencies: { DATA_GRID_SELECTOR } });

fixture.disablePageReloads`Column resizing with column hiding`
  .page(url(__dirname, '../../container.html'));

test('Column resizing should work correctly with columnHidingEnabled option', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  const headerCellBorder = Selector('[e2e-header-border]');
  const separator = dataGrid.getColumnResizeSeparator();

  await t.hover(headerCellBorder);
  await t.drag(separator, 1000, 0, DRAG_MOUSE_OPTS);
  await takeScreenshot('col-resizing_middle-cell-max-right.png', dataGrid.element);

  await t.hover(headerCellBorder);
  await t.drag(separator, -1000, 0, DRAG_MOUSE_OPTS);
  await takeScreenshot('col-resizing_middle-cell-max-left.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: new Array(20)
    .fill(null)
    .map((_, idx) => ({
      A: `A_${idx}`,
      B: `B_${idx}`,
      C: `C_${idx}`,
      D: `D_${idx}`,
    })),
  columns: ['A', {
    dataField: 'B',
    headerCellTemplate: HEADER_CELL_TEMPLATE_FUNC,
  }, 'C', 'D'],
  columnHidingEnabled: true,
  allowColumnResizing: true,
})).after(async () => disposeDataGrid());

test('Should correctly resize column when the last column resized', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  const border = Selector('[e2e-header-border]').nth(0);
  const lastBorder = Selector('[e2e-header-border]').nth(1);
  const separator = dataGrid.getColumnResizeSeparator();

  await t.hover(lastBorder);
  await t.drag(separator, 1000, 0, DRAG_MOUSE_OPTS);
  await takeScreenshot('col-resizing_last-cell-max-right.png', dataGrid.element);

  await t.hover(border);
  await t.drag(separator, 1000, 0, DRAG_MOUSE_OPTS);
  await takeScreenshot('col-resizing_middle-cell-with-last-cell.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDataGrid', {
  dataSource: new Array(20)
    .fill(null)
    .map((_, idx) => ({
      A: `A_${idx}`,
      B: `B_${idx}`,
      C: `C_${idx}`,
      D: `D_${idx}`,
    })),
  columns: [
    {
      dataField: 'A',
      headerCellTemplate: HEADER_CELL_TEMPLATE_FUNC,
    },
    'B',
    {
      dataField: 'C',
      headerCellTemplate: HEADER_CELL_TEMPLATE_FUNC,
    },
    'D',
  ],
  columnHidingEnabled: true,
  allowColumnResizing: true,
})).after(async () => disposeDataGrid());

safeSizeTest('Column hiding should work with resized columns', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

  const headerCellBorder = Selector('[e2e-header-border]');
  const separator = dataGrid.getColumnResizeSeparator();

  await t.hover(headerCellBorder);
  await t.drag(separator, 300, 0, DRAG_MOUSE_OPTS);
  await t.resizeWindow(250, 400);
  await t.click(dataGrid.getDataRow(0).getAdaptiveMore());
  await takeScreenshot('col-resizing_hidden-col-after-window-resize.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [400, 400]).before(async () => createWidget('dxDataGrid', {
  dataSource: new Array(20)
    .fill(null)
    .map((_, idx) => ({
      A: `A_${idx}`,
      B: `B_${idx}`,
      C: `C_${idx}`,
      D: `D_${idx}`,
    })),
  columns: ['A', 'B', {
    dataField: 'C',
    headerCellTemplate: HEADER_CELL_TEMPLATE_FUNC,
  }, 'D'],
  columnHidingEnabled: true,
  allowColumnResizing: true,
})).after(async () => disposeDataGrid());
