import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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
  const checkAIColumnTexts = async (
    t: TestController,
    component: DataGrid,
    expectedRowCount: number,
  ): Promise<void> => {
    const visibleRows: Record<string, any>[] = await component.apiGetVisibleRows();

    await t.expect(visibleRows.length).eql(expectedRowCount);

    // eslint-disable-next-line no-restricted-syntax
    for (const row of visibleRows) {
      await t
        .expect(component.locator('td').nth(row.dataIndex, 3).textContent)
        .eql(`Response ${row.data.name}`);
    }
  };

  const resolveAIRequest = ClientFunction((): void => {
    const { aiResponseData } = (window as any);
    const { aiResolve } = (window as any);

    if (aiResponseData && aiResolve) {
      aiResolve(aiResponseData);

      (window as any).aiResponseData = null;
      (window as any).aiResolve = null;
    }
  });

  const deleteGlobalVariables = ClientFunction((): void => {
    delete (window as any).aiResponseData;
    delete (window as any).aiResolve;
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

    // arrange
      // assert
    expect(await dataGrid.getLoadPanel().isVisible());
    await t.ok();

    // act
    await resolveAIRequest();

    // assert
    expect(await page.locator('.dx-datagrid').first().isVisible());
    await t.ok();
    expect(await dataGrid.getLoadPanel().isVisible());
    await t.notOk();
    await checkAIColumnTexts(t, dataGrid, 11);

    // act
    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { y: 1000 });

    // assert
    expect(await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTop()));
    await t.eql(1000);
    expect(await dataGrid.apiPageIndex());
    await t.eql(0);
    expect(await page.locator('.dx-data-row').nth(20).locator('td').nth(0).textContent());
    await t.eql('21');
    expect(await dataGrid.getLoadPanel().isVisible());
    await t.ok();

    // act
    await resolveAIRequest();

    // assert
    expect(await page.locator('.dx-datagrid').first().isVisible());
    await t.ok();
    expect(await dataGrid.getLoadPanel().isVisible());
    await t.notOk();
    await checkAIColumnTexts(t, dataGrid, 12);
  });
});
