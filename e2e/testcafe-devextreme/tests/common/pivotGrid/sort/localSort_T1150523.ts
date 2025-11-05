import { RequestLogger, RequestMock } from 'testcafe';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture`pivotGrid_sort`
  .page(url(__dirname, '../../../container.html'));

test('Should sort without DataSource reload if scrolling mode isn\'t virtual', async (t) => {
  const requestLogger = RequestLogger(/\/api\/data/);
  const pivotGrid = new PivotGrid('#container');

  await t.addRequestHooks(requestLogger);

  await t.wait(500);

  requestLogger.clear();
  const initialRequestCount = await requestLogger.count(() => true);

  await t.click(pivotGrid.getColumnHeaderArea().getField());

  await t.wait(500);

  const afterSortRequestCount = await requestLogger.count(() => true);
  const requestCount = afterSortRequestCount - initialRequestCount;

  await t.expect(requestCount).eql(0);

  await t.removeRequestHooks(requestLogger);
}).before(async (t) => {
  const apiRequestMock = RequestMock()
    .onRequestTo(/\/api\/data\?skip/)
    .respond(
      {
        data: [
          { id: 0, label: 'A', value: 10 },
          { id: 1, label: 'B', value: 20 },
          { id: 2, label: 'C', value: 30 },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/data\?group/)
    .respond(
      {
        data: [
          {
            key: 'A',
            items: null,
            summary: [10],
          },
          {
            key: 'B',
            items: null,
            summary: [20],
          },
          {
            key: 'C',
            items: null,
            summary: [30],
          },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    );

  (t.ctx as any).apiRequestMock = apiRequestMock;
  await t.addRequestHooks(apiRequestMock);

  return createWidget('dxPivotGrid', () => ({
    allowSorting: true,
    fieldPanel: { visible: true },
    dataSource: {
      remoteOperations: true,
      store: (window as any).DevExpress.data.AspNet.createStore({
        key: 'id',
        loadUrl: 'https://api/data',
      }),
      fields: [
        {
          dataField: 'label',
          area: 'column',
        },
        {
          dataField: 'value',
          dataType: 'number',
          area: 'data',
        },
      ],
    },
  }));
}).after(async (t) => {
  await t.removeRequestHooks((t.ctx as any).apiRequestMock);
});

test('Should sort with DataSource reload if scrolling mode is virtual', async (t) => {
  const requestLogger = RequestLogger(/\/api\/data/);
  const pivotGrid = new PivotGrid('#container');

  await t.addRequestHooks(requestLogger);

  await t.wait(500);

  requestLogger.clear();
  const initialRequestCount = await requestLogger.count(() => true);

  await t.click(pivotGrid.getColumnHeaderArea().getField());

  const afterSortRequestCount = await requestLogger.count(() => true);
  const requestCount = afterSortRequestCount - initialRequestCount;

  await t.expect(requestCount).eql(1);

  await t.removeRequestHooks(requestLogger);
}).before(async (t) => {
  const apiRequestMock = RequestMock()
    .onRequestTo(/\/api\/data\?skip/)
    .respond(
      {
        data: [
          { id: 0, label: 'A', value: 10 },
          { id: 1, label: 'B', value: 20 },
          { id: 2, label: 'C', value: 30 },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    )
    .onRequestTo(/\/api\/data\?group/)
    .respond(
      {
        data: [
          {
            key: 'A',
            items: null,
            summary: [10],
          },
          {
            key: 'B',
            items: null,
            summary: [20],
          },
          {
            key: 'C',
            items: null,
            summary: [30],
          },
        ],
      },
      200,
      { 'access-control-allow-origin': '*' },
    );

  (t.ctx as any).apiRequestMock = apiRequestMock;
  await t.addRequestHooks(apiRequestMock);

  return createWidget('dxPivotGrid', () => ({
    allowSorting: true,
    fieldPanel: { visible: true },
    scrolling: { mode: 'virtual' },
    dataSource: {
      remoteOperations: true,
      store: (window as any).DevExpress.data.AspNet.createStore({
        key: 'id',
        loadUrl: 'https://api/data',
      }),
      fields: [
        {
          dataField: 'label',
          area: 'column',
        },
        {
          dataField: 'value',
          dataType: 'number',
          area: 'data',
        },
      ],
    },
  }));
}).after(async (t) => {
  await t.removeRequestHooks((t.ctx as any).apiRequestMock);
});
