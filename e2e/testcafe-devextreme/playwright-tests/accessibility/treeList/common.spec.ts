import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

function getData(rowCount: number): Record<string, any>[] {
  const data = Array.from({ length: rowCount }, (_, index) => ({
    id: index + 1,
    parentId: index % 5,
    field1: `test 1 ${index + 2}`,
    field2: `test 2 ${index + 2}`,
  }));
  data.unshift({ id: 0, parentId: -1, field1: 'test 1 0', field2: 'test 2 0' });
  return data;
}

test.describe('Accessibility - TreeList common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('search panel, pager and selection', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: getData(40),
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      rootValue: -1,
      autoExpandAll: true,
      paging: { enabled: true, pageSize: 5 },
      scrolling: { mode: 'standard' },
      selection: { mode: 'multiple' },
      searchPanel: { visible: true },
      columns: ['id', 'parentId', 'field1', 'field2'],
    });
    await a11yCheck(page, {}, '#container');
  });
});
