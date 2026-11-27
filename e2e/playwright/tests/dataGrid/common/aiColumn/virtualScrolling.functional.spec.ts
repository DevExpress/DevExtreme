import type { Page } from '@playwright/test';
import type { Properties } from 'devextreme/ui/data_grid';
import { expect, test } from '../../../../fixtures';
import { AI_INTEGRATION_PAGE_URL, DEFAULT_SELECTOR } from '../../../../helpers/const';
import { createWidget } from '../../../../helpers/createWidget';
import DataGrid from '../../../../models/dataGrid';

test.use({ containerUrl: AI_INTEGRATION_PAGE_URL });

const CLASS = {
  loadPanelContent: 'dx-loadpanel-content',
};

const checkAIColumnTexts = async (
  component: DataGrid,
  expectedRowCount: number,
): Promise<void> => {
  await expect.poll(async () => (await component.apiGetVisibleRows()).length)
    .toBe(expectedRowCount);

  const visibleRows = await component.apiGetVisibleRows();

  for (const row of visibleRows) {
    await expect(component.getDataCell(row.dataIndex, 3).element)
      .toHaveText(`Response ${(row.data as { name: string }).name}`);
  }
};

const isAIRequestPending = (page: Page): Promise<boolean> => page.evaluate(
  () => !!(window as any).aiResolve,
);

const resolveAIRequest = (page: Page): Promise<void> => page.evaluate((): void => {
  const { aiResponseData } = (window as any);
  const { aiResolve } = (window as any);

  if (aiResponseData && aiResolve) {
    aiResolve(aiResponseData);

    (window as any).aiResponseData = null;
    (window as any).aiResolve = null;
  }
});

// Runs in the page. The AI integration keeps each request pending until the test resolves it.
const virtualGrid = (pageSize: number): Properties => {
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
      pageSize,
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

          aiIntegration: new (window as any).DevExpress.aiIntegration.AIIntegration({
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
};

const SCROLLING_CASES = [
  { title: 'without changing the page index', pageSize: 50, pageIndexAfterScroll: 0 },
  { title: 'with changing the page index', pageSize: 20, pageIndexAfterScroll: 1 },
];

test.describe('Ai Column.Virtual Scrolling.Functional', () => {
  SCROLLING_CASES.forEach(({ title, pageSize, pageIndexAfterScroll }) => {
    test(`DataGrid should send an AI request for rendered rows after scrolling ${title}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', virtualGrid, DEFAULT_SELECTOR, { arg: pageSize });

      const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

      await expect.poll(() => isAIRequestPending(page)).toBe(true);
      await expect.poll(() => dataGrid.getLoadPanel().isVisible()).toBe(true);

      await resolveAIRequest(page);

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect(dataGrid.element.locator(`.${CLASS.loadPanelContent}`)).toBeHidden();
      await checkAIColumnTexts(dataGrid, 11);

      await dataGrid.scrollTo({ top: 1000 });

      await expect.poll(() => dataGrid.getScrollTop()).toBe(1000);
      await expect(dataGrid.getDataCell(20, 0).element).toHaveText('21');
      await expect.poll(() => dataGrid.apiPageIndex()).toBe(pageIndexAfterScroll);
      await expect.poll(() => isAIRequestPending(page)).toBe(true);
      await expect.poll(() => dataGrid.getLoadPanel().isVisible()).toBe(true);

      await resolveAIRequest(page);

      await expect.poll(() => dataGrid.isReady()).toBe(true);
      await expect(dataGrid.element.locator(`.${CLASS.loadPanelContent}`)).toBeHidden();
      await checkAIColumnTexts(dataGrid, 12);
    });
  });
});
