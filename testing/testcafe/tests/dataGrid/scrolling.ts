import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

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
}).before(() => {
  function getData(): any[] {
    const items = [];
    const item = {};
    for (let i = 0; i < 50; i += 1) {
      item[`field_0_${i}`] = `val_0_${i}`;
    }
    items.push(item);
    return items;
  }
  return createWidget('dxDataGrid', {
    dataSource: getData(),
    columnWidth: 100,
  });
});

test('DataGrid should set the scrollbar position to the right on resize when RTL is enabled (T934842)', async (t) => {
  const dataGrid = new DataGrid('#container');

  const getMaxRightOffset = async (): Promise<number> => {
    const scrollWidth = await dataGrid.getScrollWidth();
    const rowsViewWidth = await dataGrid.getRowsView().clientWidth;
    const maxRightOffset = scrollWidth - rowsViewWidth;

    return maxRightOffset;
  };

  // act
  await t.resizeWindow(900, 250);
  let maxRightOffset = await getMaxRightOffset();

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);

  // act
  await t.resizeWindow(700, 250);
  maxRightOffset = await getMaxRightOffset();

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);

  // act
  await t.resizeWindow(600, 250);
  maxRightOffset = await getMaxRightOffset();

  // assert
  await t
    .expect(dataGrid.getScrollLeft()).eql(maxRightOffset);
}).before(() => {
  function getData(): any[] {
    const items = [];
    const item = {};
    for (let i = 0; i < 50; i += 1) {
      item[`field_0_${i}`] = `val_0_${i}`;
    }
    items.push(item);
    return items;
  }
  return createWidget('dxDataGrid', {
    dataSource: getData(),
    rtlEnabled: true,
    columnWidth: 100,
  });
});
