import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.Virtual Scrolling.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('DataGrid should send an AI request for rendered rows after scrolling without changing the page index', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
        const generateData = (rowCount: number): Record<string, number | string>[] => {
          const result: Record<string, number | string>[] = [];

          for (let i = 0; i < rowCount; i += 1) {
            result.push({ id: i + 1, name: `Name ${i + 1}`, value: (i + 1) * 10 });
          }

          return result;
        };

        return {
          dataSource: generateData(200),
          height: 500,
          keyExpr: 'id',
          paging: {
            pageSize: 50,
          },
          scrolling: {
            mode: 'virtual',
          },
          columns: [
            { dataField: 'id', caption: 'ID' },
            { dataField: 'name', caption: 'Name' },
            { dataField: 'value', caption: 'Value' },
            {
              type: 'ai',
              caption: 'AI Column',
              name: 'myColumn',
              ai: {
                prompt: 'Initial prompt',
                // eslint-disable-next-line new-cap
                aiIntegration: new (window as any).DevExpress.aiIntegration({
                  sendRequest(prompt) {
                    return {
                      promise: new Promise<string>((resolve) => {
                        const result: Record<string, string> = {};

                        Object.entries(prompt.data?.data).forEach(([key, value]) => {
                          result[key] = `Response ${(value as any).name}`;
                        });

                        (window as any).aiResponseData = JSON.stringify(result);
                        (window as any).aiResolve = resolve;
                      }),
                      abort: (): void => {},
                    };
                  },
                }),
              },
            },
          ],
        };
      });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await page.evaluate(() => {
      const resolve = (window as any).aiResolve;
      const data = (window as any).aiResponseData;
      if (resolve && data) {
        resolve(data);
      }
    });

    await page.waitForTimeout(500);

    const pageIndexBefore = await dataGrid.apiPageIndex() as number;

    await dataGrid.scrollTo({ top: 500 });
    await page.waitForTimeout(500);

    const pageIndexAfter = await dataGrid.apiPageIndex() as number;
    expect(pageIndexAfter).toBe(pageIndexBefore);
  });
});
