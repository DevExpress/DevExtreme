import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('PivotGrid_export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should call \'onExporting\' when export button clicked', async ({ page }) => {
    await createWidget(page, 'dxPivotGrid', {
      dataSource: {
        fields: [{
          caption: 'data A',
          dataField: 'data_A',
        }],
        store: [],
      },
      export: {
        enabled: true,
      },
      onExporting() {
        (window as any).__exportCalled = true;
      },
    });

    await page.locator('#container .dx-pivotgrid-export-button').click();

    const exportCalled = await page.evaluate(() => (window as any).__exportCalled as boolean);
    expect(exportCalled).toBeTruthy();
  });
});
