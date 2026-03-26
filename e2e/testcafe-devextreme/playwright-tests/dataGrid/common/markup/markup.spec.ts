import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Icon Sizes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Load panel should support string height and width', async ({ page }) => {
    // TODO: Playwright migration - load panel content locator times out (loadPanel not shown)
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: [
        'field1', 'field2', 'field3',
      ],
      width: 700,
      loadPanel: {
        enabled: true,
        height: '400px',
        width: '330px',
      },
    });

    const dataGrid = new DataGrid(page);
    await dataGrid.apiBeginCustomLoading('test');

    const loadPanelContent = dataGrid.getLoadPanel().getContent();
    const height = await loadPanelContent.evaluate((el) => getComputedStyle(el).height);
    const width = await loadPanelContent.evaluate((el) => getComputedStyle(el).width);

    expect(height).toBe('400px');
    expect(width).toBe('330px');
  });
});
