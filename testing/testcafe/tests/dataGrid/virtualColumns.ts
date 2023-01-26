import { ClientFunction, Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DataGrid from '../../model/dataGrid';

const showDataGrid = ClientFunction(() => {
  $('#wrapperContainer').css('display', '');
});

fixture.disablePageReloads`Virtual  Columns`
  .page(url(__dirname, '../container.html'));

const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
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

  await dataGrid.scrollTo({ x: 50 });

  await t.expect(dataGrid.getScrollLeft()).eql(50);

  await dataGrid.scrollTo({ x: 100 });

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

  await dataGrid.scrollTo({ x: 1500 });

  await t
    .click(dataGrid.getDataCell(0, 18).element)
    .expect(dataGrid.getDataCell(0, 18).element.focused)
    .ok();

  await dataGrid.scrollTo({ x: 1200 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1200);

  await dataGrid.scrollTo({ x: 1000 });

  await t
    .expect(dataGrid.getScrollLeft())
    .eql(1000);

  await dataGrid.scrollTo({ x: 800 });

  await t
    .wait(200)
    .expect(dataGrid.getScrollLeft())
    .eql(800);
}).before(async () => createWidget('dxDataGrid', {
  width: 450,
  dataSource: generateData(10, 50),
  columnWidth: 100,
  loadingTimeout: null,
  scrolling: {
    columnRenderingMode: 'virtual',
  },
}));

// T1090735
test('The updateDimensions method should render the grid if a container was hidden and columnRenderingMode is virtual', async (t) => {
  const dataGrid = new DataGrid('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(Selector('#wrapperContainer').visible)
    .notOk();

  await showDataGrid();

  await t
    .wait(200)
    .expect(Selector('#wrapperContainer').visible)
    .ok();

  await dataGrid.apiUpdateDimensions();

  await t
    .expect(await takeScreenshot('T1090735-grid-virtual-columns.png', '#wrapperContainer'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.maximizeWindow();

  await ClientFunction(() => {
    $('#container').wrap('<div id=\'wrapperContainer\' style=\'display: none;\'></div>');
  })();

  return createWidget('dxDataGrid', {
    height: 440,
    dataSource: generateData(150, 500),
    columnWidth: 100,
    scrolling: {
      columnRenderingMode: 'virtual',
    },
  });
});
