import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`Virtual Columns.Functional`
  .page(url(__dirname, '../../../container.html'));

const generateData = (rowCount: number, columnCount: number): Record<string, unknown>[] => {
  const items: Record<string, unknown>[] = [];

  for (let i = 0; i < rowCount; i += 1) {
    const item = {};

    for (let j = 0; j < columnCount; j += 1) {
      item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
    }

    items.push(item);
  }

  return items;
};

test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the right when columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .expect(dataGrid.getDataCell(0, 0).element.focused)
    .ok();

  await dataGrid.scrollTo(t, { x: 50 });

  await t.expect(dataGrid.getScrollLeft()).eql(50);

  await dataGrid.scrollTo(t, { x: 100 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(100);
}).before(async () => createWidget('dxDataGrid', {
  width: 450,
  dataSource: generateData(10, 30),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('DataGrid should not scroll back to the focused cell after horizontal scrolling to the left when columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');

  await dataGrid.scrollTo(t, { x: 1500 });

  await t
    .click(dataGrid.getDataCell(0, 18).element)
    .expect(dataGrid.getDataCell(0, 18).element.focused)
    .ok();

  await dataGrid.scrollTo(t, { x: 1200 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1200);

  await dataGrid.scrollTo(t, { x: 1000 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1000);

  await dataGrid.scrollTo(t, { x: 800 });

  await t
    .wait(200)
    .expect(dataGrid.getScrollLeft())
    .eql(800);
}).before(async () => createWidget('dxDataGrid', {
  width: 450,
  dataSource: generateData(10, 50),
  columnWidth: 100,
  // @ts-expect-error private option
  loadingTimeout: null,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('DataGrid should scroll to the first cell of the next row and focus it when navigating with Tab key', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await dataGrid.scrollTo(t, { x: 10000 });

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1500)
    .expect(dataGrid.getDataCell(0, 19).element.exists)
    .ok();

  // act
  await t.click(dataGrid.getDataCell(0, 19).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(0, 19).element.focused)
    .ok();

  // act
  await t.pressKey('tab');

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(0)
    .expect(dataGrid.getDataCell(1, 0).element.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  width: 500,
  dataSource: generateData(10, 20),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

test('DataGrid should scroll to the last cell of the previous row and focus it when navigating with Shift+Tab keys', async (t) => {
  // arrange
  const dataGrid = new DataGrid('#container');

  // assert
  await t
    .expect(dataGrid.isReady())
    .ok();

  // act
  await t.click(dataGrid.getDataCell(1, 0).element);

  // assert
  await t
    .expect(dataGrid.getDataCell(1, 0).element.focused)
    .ok();

  // act
  await t.pressKey('shift+tab');

  // assert
  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1500)
    .expect(dataGrid.getDataCell(0, 19).element.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  width: 500,
  dataSource: generateData(10, 20),
  columnWidth: 100,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));
