import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { mockApi } from '../../../../helpers/apiMock';
import { createWidget } from '../../../../helpers/createWidget';
import { createRequestLogger } from '../../../../helpers/requestLogger';
import PivotGrid from '../../../../models/pivotGrid';

const API_URL = /\/api\/data/;

const mockDataApi = async (page: Page): Promise<void> => mockApi(page, [
  {
    url: /\/api\/data\?skip/,
    body: {
      data: [
        { id: 0, label: 'A', value: 10 },
        { id: 1, label: 'B', value: 20 },
        { id: 2, label: 'C', value: 30 },
      ],
    },
  },
  {
    url: /\/api\/data\?group/,
    body: {
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
  },
]);

test('Should sort without DataSource reload if scrolling mode isn\'t virtual', async ({ page }) => {
  await mockDataApi(page);
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

  const pivotGrid = new PivotGrid(page, '#container');
  const field = pivotGrid.getColumnHeaderArea().getField();

  await expect(field.locator('.dx-sort-up')).toBeVisible();

  const requestLogger = createRequestLogger(page, API_URL);

  // The initial load of the store is what the counter must not see: the assertion is about the
  // requests the sort makes. The TestCafe original cleared the logger at this same point.
  await page.waitForLoadState('networkidle');
  requestLogger.clear();

  await field.click();

  await expect(field.locator('.dx-sort-down')).toBeVisible();
  // The assertion is that nothing happens, so the reload has to be given the chance to start.
  await page.waitForTimeout(500);

  expect(requestLogger.count()).toBe(0);

  requestLogger.dispose();
});

test('Should sort with DataSource reload if scrolling mode is virtual', async ({ page }) => {
  await mockDataApi(page);
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

  const pivotGrid = new PivotGrid(page, '#container');
  const field = pivotGrid.getColumnHeaderArea().getField();

  await expect(field.locator('.dx-sort-up')).toBeVisible();

  const requestLogger = createRequestLogger(page, API_URL);

  await page.waitForLoadState('networkidle');
  requestLogger.clear();

  await field.click();

  await expect.poll(() => requestLogger.count()).toBe(1);

  requestLogger.dispose();
});
