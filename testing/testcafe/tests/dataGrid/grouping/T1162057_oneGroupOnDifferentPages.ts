import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { RequestMock } from 'testcafe';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import DataGrid from '../../../model/dataGrid';

fixture`Grouping Panel - One group on different pages`
  .page(url(__dirname, '../../containerAspNet.html'));

const GRID_SELECTOR = '#container';

const endsOnNextPageApiMock = RequestMock()
  .onRequestTo(/\/api\/data\?skip=0&take=5/)
  .respond(
    {
      data: [
        { key: 'KeyA', items: null, count: 6 },
        { key: 'KeyB', items: null, count: 3 },
      ],
      groupCount: 2,
      totalCount: 11,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data\?skip=0&take=1/)
  .respond(
    {
      data: [
        { key: 'KeyA', items: null, count: 6 },
      ],
      groupCount: 2,
      totalCount: 11,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data\?skip=0&take=3/)
  .respond(
    {
      data: [
        { key: 'KeyA', items: null, count: 6 },
        { key: 'KeyB', items: null, count: 3 },
      ],
      groupCount: 2,
      totalCount: 11,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data\?take=4.*&filter=.*KeyA/)
  .respond(
    {
      data: [
        { id: 0, data: 'A' },
        { id: 1, data: 'B' },
        { id: 2, data: 'C' },
        { id: 3, data: 'D' },
      ],
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data\?skip=4.*&filter=.*KeyA/)
  .respond(
    {
      data: [
        { id: 4, data: 'E' },
        { id: 5, data: 'F' },
      ],
    },
    200,
    { 'access-control-allow-origin': '*' },
  );

test('Group panel restored from cache and ends at the next page', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.click(dataGrid.getGroupRow(0).getCell(0).element);
  await takeScreenshot('group-panel_loaded_first-page.png', dataGrid.element);

  await t.click(dataGrid.getPager().getNavPage('2').element);
  await takeScreenshot('group-panel_loaded_second-page.png', dataGrid.element);

  await t.click(dataGrid.getPager().getNavPage('1').element);
  await takeScreenshot('group-panel_restored_first-page.png', dataGrid.element);

  await t.click(dataGrid.getPager().getNavPage('2').element);
  await takeScreenshot('group-panel_restored_second-page.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.addRequestHooks(endsOnNextPageApiMock);
  await createWidget('dxDataGrid', () => ({
    dataSource: (window as any).DevExpress.data.AspNet.createStore({
      key: 'id',
      loadUrl: 'https://api/data',
    }),
    columns: [
      'data',
      {
        dataField: 'key',
        groupIndex: 0,
      },
    ],
    groupPanel: {
      visible: true,
    },
    grouping: {
      autoExpandAll: false,
    },
    remoteOperations: {
      groupPaging: true,
    },
    pager: {
      visible: true,
      showInfo: true,
      showPageSizeSelector: true,
      allowedPageSizes: [5],
      displayMode: 'full',
    },
    paging: {
      pageSize: 5,
    },
  }));
}).after(async (t) => {
  await t.removeRequestHooks(endsOnNextPageApiMock);
});

const endsOnPageApiMock = RequestMock()
  .onRequestTo(/\/api\/data\?skip=0&take=5/)
  .respond(
    {
      data: [
        { key: 'KeyA', items: null, count: 4 },
        { key: 'KeyB', items: null, count: 2 },
      ],
      groupCount: 2,
      totalCount: 8,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data\?skip=0&take=1/)
  .respond(
    {
      data: [
        { key: 'KeyA', items: null, count: 4 },
      ],
      groupCount: 2,
      totalCount: 8,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data\?skip=1&take=5/)
  .respond(
    {
      data: [
        { key: 'KeyB', items: null, count: 2 },
      ],
      groupCount: 2,
      totalCount: 8,
    },
    200,
    { 'access-control-allow-origin': '*' },
  )
  .onRequestTo(/\/api\/data.*&filter=.*KeyA/)
  .respond(
    {
      data: [
        { id: 0, data: 'A' },
        { id: 1, data: 'B' },
        { id: 2, data: 'C' },
        { id: 3, data: 'D' },
      ],
    },
    200,
    { 'access-control-allow-origin': '*' },
  );

test('Group panel restored from cache and ends at the page end', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const dataGrid = new DataGrid(GRID_SELECTOR);

  await t.click(dataGrid.getGroupRow(0).getCell(0).element);
  await takeScreenshot('group-panel_loaded_page-end.png', dataGrid.element);

  await t.click(dataGrid.getPager().getNavPage('2').element)
    .click(dataGrid.getPager().getNavPage('1').element);
  await takeScreenshot('group-panel_restored_page-end.png', dataGrid.element);

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.addRequestHooks(endsOnPageApiMock);
  await createWidget('dxDataGrid', () => ({
    dataSource: (window as any).DevExpress.data.AspNet.createStore({
      key: 'id',
      loadUrl: 'https://api/data',
    }),
    columns: [
      'data',
      {
        dataField: 'key',
        groupIndex: 0,
      },
    ],
    groupPanel: {
      visible: true,
    },
    grouping: {
      autoExpandAll: false,
    },
    remoteOperations: {
      groupPaging: true,
    },
    pager: {
      visible: true,
      showInfo: true,
      showPageSizeSelector: true,
      allowedPageSizes: [5],
      displayMode: 'full',
    },
    paging: {
      pageSize: 5,
    },
  }));
}).after(async (t) => {
  await t.removeRequestHooks(endsOnPageApiMock);
});
