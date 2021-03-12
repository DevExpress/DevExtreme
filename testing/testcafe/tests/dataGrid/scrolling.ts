import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

async function getMaxRightOffset(dataGrid: DataGrid): Promise<number> {
  const scrollWidth = await dataGrid.getScrollWidth();
  const rowsViewWidth = await dataGrid.getRowsView().clientWidth;
  return scrollWidth - rowsViewWidth;
}

async function getRightScrollOffset(dataGrid: DataGrid): Promise<number> {
  const maxHorizontalOffset = await getMaxRightOffset(dataGrid);
  const scrollLeft = await dataGrid.getScrollLeft();
  return maxHorizontalOffset - scrollLeft;
}

function getData(rowCount, colCount): Record<string, string>[] {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j += 1) {
      item[`field_${i}_${j}`] = `val_${i}_${j}`;
    }
    items.push(item);
  }

  return items;
}

fixture`Scrolling`
  .page(url(__dirname, '../container.html'));

test('DataGrid should set the scrollbar position to the left on resize (T934842)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(0);

  // act
  await t.resizeWindow(700, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(0);

  // act
  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(0);
}).before(() => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  columnWidth: 100,
}));

test('DataGrid should set the scrollbar position to the right on resize when RTL is enabled (T934842)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);
  let maxRightOffset = await getMaxRightOffset(dataGrid);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);

  // act
  await t.resizeWindow(700, 250);
  maxRightOffset = await getMaxRightOffset(dataGrid);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);

  // act
  await t.resizeWindow(600, 250);
  maxRightOffset = await getMaxRightOffset(dataGrid);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);
}).before(() => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  rtlEnabled: true,
  columnWidth: 100,
}));

test('DataGrid should not reset its left scroll position on window resize when columnRenderingMode is virtual with fixed columns', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);
  await dataGrid.scrollTo({ x: 100 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(100);

  // act
  await t.resizeWindow(700, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(100);

  // act
  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(100);
}).before(() => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  customizeColumns(columns) {
    columns[0].fixed = true;
    columns[1].fixed = true;
    columns[48].fixed = true;
    columns[48].fixedPosition = 'right';
    columns[49].fixed = true;
    columns[49].fixedPosition = 'right';
  },
}));

test('DataGrid should not reset its right scroll position on window resize when columnRenderingMode is virtual with fixed columns (rtlEnabled)', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t.resizeWindow(900, 250);
  const maxHorizontalPosition = await getMaxRightOffset(dataGrid);
  const scrollLeft = maxHorizontalPosition - 100;
  await dataGrid.scrollTo({ x: scrollLeft });

  // assert
  await t
    .expect(await getRightScrollOffset(dataGrid)).eql(100);

  // act
  await t.resizeWindow(700, 250);

  // assert
  await t
    .expect(await getRightScrollOffset(dataGrid)).eql(100);

  // act
  await t.resizeWindow(600, 250);

  // assert
  await t
    .expect(await getRightScrollOffset(dataGrid)).eql(100);
}).before(() => createWidget('dxDataGrid', {
  dataSource: getData(1, 50),
  columnWidth: 100,
  rtlEnabled: true,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
  customizeColumns(columns) {
    columns[0].fixedPosition = 'right';
    columns[0].fixed = true;
    columns[1].fixedPosition = 'right';
    columns[1].fixed = true;
    columns[48].fixed = true;
    columns[49].fixed = true;
  },
}));

test('DataGrid should not reset its top scroll position after cell modification with master-detail', async (t) => {
  const dataGrid = new DataGrid('#container');

  // act
  await t
    .click(dataGrid.getDataRow(0).getCommandCell(0).element);
  await dataGrid.scrollTo({ y: 220 });
  const scrollTop = await dataGrid.getScrollTop();
  await t
    .click(dataGrid.getDataRow(1).getCommandCell(0).element)
    .click(dataGrid.getDataCell(2, 1).element)
    .typeText(dataGrid.getDataCell(2, 1).element, 'new_value')
    .pressKey('Tab');
  // assert
  const newScrollTop = await dataGrid.getScrollTop();
  await t.expect(Math.abs(scrollTop - newScrollTop) < 2).ok(`ScrollTop ${scrollTop} changes after editing to ${newScrollTop}`);
}).before(() => createWidget('dxDataGrid', {
  height: 300,
  dataSource: [{ FirstName: 'A', LastName: 'B' }, { FirstName: 'C', LastName: 'D' }],
  editing: {
    allowUpdating: true,
    mode: 'cell',
  },
  masterDetail: {
    enabled: true,
    template: (container): void => {
      $('<div>')
        .css('height', '200px')
        .appendTo(container);
    },
  },
}));
