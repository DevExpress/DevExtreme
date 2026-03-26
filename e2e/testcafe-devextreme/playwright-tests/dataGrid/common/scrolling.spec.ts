import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('DataGrid should set the scrollbar position to the left on resize (T934842)', async ({ page }) => {
    // TODO: Playwright migration - getScrollable() returns undefined after viewport resize
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1, 50),
      columnWidth: 100,
    });

    const dataGrid = new DataGrid(page);

    await page.setViewportSize({ width: 900, height: 250 });
    expect(await dataGrid.getScrollLeft()).toBe(0);

    await page.setViewportSize({ width: 700, height: 250 });
    expect(await dataGrid.getScrollLeft()).toBe(0);

    await page.setViewportSize({ width: 600, height: 250 });
    expect(await dataGrid.getScrollLeft()).toBe(0);
  });

  test('Warning should be thrown if scrolling is virtual and height is not specified', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [{ column: 'value' }],
    });

    await page.waitForTimeout(100);

    const warningExists = warnings.some((message) => message.startsWith('W1025'));
    expect(warningExists).toBeTruthy();
  });

  test('Warning should not be thrown if scrolling is virtual and height is specified with option', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'warning') warnings.push(msg.text());
    });

    await createWidget(page, 'dxDataGrid', {
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [{ column: 'value' }],
      height: 200,
    });

    const warningExists = warnings.some((message) => message.startsWith('W1025'));
    expect(warningExists).toBeFalsy();
  });

  ['height', 'max-height'].forEach((cssOption) => {
    test(`Warning should not be thrown if scrolling is virtual and height is specified with css (${cssOption})`, async ({ page }) => {
      const warnings: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'warning') warnings.push(msg.text());
      });

      await page.addStyleTag({ content: `#container { ${cssOption}: 200px; }` });

      await createWidget(page, 'dxDataGrid', {
        scrolling: {
          mode: 'virtual',
        },
        dataSource: [{ column: 'value' }],
      });

      const warningExists = warnings.some((message) => message.startsWith('W1025'));
      expect(warningExists).toBeFalsy();
    });
  });
});
