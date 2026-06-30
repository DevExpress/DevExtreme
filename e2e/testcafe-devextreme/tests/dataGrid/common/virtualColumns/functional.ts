import { ClientFunction } from 'testcafe';
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

test('DataGrid with async templates should call load method only once on initial render', async (t) => {
  const dataGrid = new DataGrid('#container');
  const getLoadCount = ClientFunction(() => (window as any)._loadCount);

  await t.expect(dataGrid.isReady()).ok();

  await t.expect(dataGrid.getDataCell(1000, 0).element.textContent).eql('1001 custom');

  await t.expect(getLoadCount()).eql(1);
}).before(async () => createWidget('dxDataGrid', () => {
  (window as any)._loadCount = 0;

  const sampleAPI = new (window as any).DevExpress.data.ArrayStore({
    key: 'id',
    data: Array.from({ length: 10000 }, (_, index) => ({
      id: index + 1,
      text: `item long text ${index + 1}`,
    })),
  });

  const store = new (window as any).DevExpress.data.CustomStore({
    key: 'id',
    load(o: any) {
      (window as any)._loadCount += 1;
      return new Promise((resolve) => {
        setTimeout(() => {
          sampleAPI.load(o).then(resolve);
        }, 100);
      });
    },
    totalCount(o: any) {
      return sampleAPI.totalCount(o);
    },
  });

  return {
    dataSource: store,
    showBorders: true,
    remoteOperations: true,
    paging: {
      pageSize: 100,
      pageIndex: 10,
    },
    scrolling: {
      mode: 'virtual',
      rowRenderingMode: 'virtual',
    },
    columns: [
      { dataField: 'id', width: 90, cellTemplate: 'myTemplate' },
      { dataField: 'text', width: 150 },
    ],
    height: 1500,
    wordWrapEnabled: true,
    templatesRenderAsynchronously: true,
    integrationOptions: {
      templates: {
        myTemplate: {
          render(e: any) {
            setTimeout(() => {
              $('<div>').text(`${e.model.text} custom`).appendTo(e.container);
              e.onRendered?.();
            }, 100);
          },
        },
      },
    },
  };
})).after(async () => ClientFunction(() => {
  delete (window as any)._loadCount;
})());
