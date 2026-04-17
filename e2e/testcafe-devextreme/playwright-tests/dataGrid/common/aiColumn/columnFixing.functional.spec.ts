import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column - Sticky columns.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test.skip('The AI column should not be fixed when the columnFixing.enabled option is true', async ({ page }) => {
    // TODO: Playwright migration - TestCafe API remnants (aiHeader.element.textContent, aiHeader.isSticky)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Name 1', value: 10 },
        { id: 2, name: 'Name 2', value: 20 },
        { id: 3, name: 'Name 3', value: 30 },
      ],
      keyExpr: 'id',
      width: 600,
      columnWidth: 200,
      columnFixing: {
        enabled: true,
      },
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
        {
          type: 'ai',
          caption: 'AI Column',
          name: 'myAiColumn',
        },
      ],
    });

    // arrange, act
      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    const aiHeader = page.locator('.dx-header-row').nth(0).locator('td').nth(3);

    // assert
    expect(await aiHeader.element.textContent).toBe('AI Column');
    expect(await aiHeader.isSticky()).toBeFalsy();
  });
});
