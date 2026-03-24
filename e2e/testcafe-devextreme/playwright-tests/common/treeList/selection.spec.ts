import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('TreeList with selection and boolean data in first column should render right (T1109666)', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
      dataSource: [
        { id: 1, parentId: 0, value: true, value1: 'text' },
        { id: 2, parentId: 1, value: true, value1: 'text' },
        { id: 3, parentId: 2, value: true, value1: 'text' },
        { id: 4, parentId: 3, value: true, value1: 'text' },
        { id: 5, parentId: 4, value: true, value1: 'text' },
        { id: 6, parentId: 5, value: true, value1: 'text' },
        { id: 7, parentId: 6, value: true, value1: 'text' },
        { id: 8, parentId: 7, value: true, value1: 'text' },
      ],
      height: 300,
      width: 400,
      autoExpandAll: true,
      columns: [{
        dataField: 'value',
        width: 100,
      }, {
        dataField: 'value1',
      }],
      selection: {
        mode: 'multiple',
      },
    });

    const treeList = page.locator('#container');

    await testScreenshot(page, 'T1109666-selection', { element: treeList });
  });

  test.skip('TreeList restore selection after the search panel has cleared (T1264312)', async ({ page }) => {
    // skipped: requires .before() with addRequestHooks/tasksApiMock, ExpandableCell page object
  });
});
