import { RequestLogger, RequestMock } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { isMaterial } from '../../../helpers/themeUtils';
import PivotGrid from '../../../model/pivotGrid';

const testFixture = () => (isMaterial() ? fixture.skip : fixture);

testFixture()`pivotGrid_sort`
  .page(url(__dirname, '../../containerAspNet.html'));

const requestLogger = RequestLogger(/\/api\/data/);
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

test('Should sort without DataSource reload if scrolling mode isn\'t virtual', async (t) => {
  const pivotGrid = new PivotGrid('#container');
  await t.addRequestHooks(requestLogger);
  const initialRequestCount = await requestLogger.count(() => true);

  await t.click(pivotGrid.getColumnHeaderArea().getAction());

  const afterSortRequestCount = await requestLogger.count(() => true);
  const requestCount = afterSortRequestCount - initialRequestCount;

  await t.expect(requestCount).eql(0);

  await t.removeRequestHooks(requestLogger);
}).before(async (t) => {
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
  await t.removeRequestHooks(apiRequestMock);
});

test('Should sort with DataSource reload if scrolling mode is virtual', async (t) => {
  const pivotGrid = new PivotGrid('#container');
  await t.addRequestHooks(requestLogger);
  const initialRequestCount = await requestLogger.count(() => true);

  await t.click(pivotGrid.getColumnHeaderArea().getAction());

  const afterSortRequestCount = await requestLogger.count(() => true);
  const requestCount = afterSortRequestCount - initialRequestCount;

  await t.expect(requestCount).eql(1);

  await t.removeRequestHooks(requestLogger);
}).before(async (t) => {
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
  await t.removeRequestHooks(apiRequestMock);
});
