import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.Adaptivity', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
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

  test('The AI column should be hidden when columnHidingEnabled is true', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      width: 350,
      columnWidth: 100,
      columnHidingEnabled: true,
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
        },
      ],
    });

    // arrange, act
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    const fourthHeaderCell = page.locator('.dx-header-row').nth(0).locator('td').nth(3);

    // assert: the AI column is hidden
    expect(await fourthHeaderCell.element.textContent).toBe('AI Column');
    expect(await fourthHeaderCell.isHidden).toBeTruthy();

    // assert: the adaptive button is visible
    expect(await page.locator('.dx-data-row').nth(0).locator('.dx-command-edit').nth(4).getAdaptiveButton().visible).toBeTruthy();
  });
    // TODO: .after() block removed
});
