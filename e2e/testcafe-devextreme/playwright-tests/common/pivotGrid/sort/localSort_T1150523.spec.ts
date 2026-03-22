import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('pivotGrid_sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should sort without DataSource reload if scrolling mode isn\'t virtual', async ({ page }) => {
    const requestLogger = RequestLogger(/\/api\/data/);
    const pivotGrid = page.locator('#container');

    await addRequestHooks(requestLogger);

    await page.waitForTimeout(500);

    requestLogger.clear();
    const initialRequestCount = await requestLogger.count(() => true);

    await click(pivotGrid.getColumnHeaderArea().getField());

    await page.waitForTimeout(500);

    const afterSortRequestCount = await requestLogger.count(() => true);
    const requestCount = afterSortRequestCount - initialRequestCount;

    expect(requestCount).toBe(0);

    await removeRequestHooks(requestLogger);

    });.before(async ({ page }) => {
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

    (t.ctx as any).apiRequestMock = apiRequestMock;
    await addRequestHooks(apiRequestMock);

    await createWidget(page, 'dxPivotGrid', () => ({
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
  }).after(async ({ page }) => {
    await removeRequestHooks((t.ctx as any).apiRequestMock);
  });

  test('Should sort with DataSource reload if scrolling mode is virtual', async ({ page }) => {
    const requestLogger = RequestLogger(/\/api\/data/);
    const pivotGrid = page.locator('#container');

    await addRequestHooks(requestLogger);

    await page.waitForTimeout(500);

    requestLogger.clear();
    const initialRequestCount = await requestLogger.count(() => true);

    await click(pivotGrid.getColumnHeaderArea().getField());

    const afterSortRequestCount = await requestLogger.count(() => true);
    const requestCount = afterSortRequestCount - initialRequestCount;

    expect(requestCount).toBe(1);

    await removeRequestHooks(requestLogger);

    });.before(async ({ page }) => {
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

    (t.ctx as any).apiRequestMock = apiRequestMock;
    await addRequestHooks(apiRequestMock);

    await createWidget(page, 'dxPivotGrid', () => ({
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
  }).after(async ({ page }) => {
    await removeRequestHooks((t.ctx as any).apiRequestMock);
  });
});
