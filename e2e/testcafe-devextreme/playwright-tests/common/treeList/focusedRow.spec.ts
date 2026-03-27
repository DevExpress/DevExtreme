import { test, expect } from '@playwright/test';
import { createWidget, TreeList } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Focused row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const getItems = (): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];
    for (let i = 0; i < 100; i += 1) {
      items.push({
        ID: i + 1,
        Name: `Name ${i + 1}`,
      });
    }
    return items;
  };

  const getTreeListConfig = (): any => ({
    dataSource: getItems(),
    keyExpr: 'ID',
    height: 500,
    stateStoring: {
      enabled: true,
      type: 'custom',
      customSave: (state) => {
        localStorage.setItem('mystate', JSON.stringify(state));
      },
      customLoad: () => {
        let state = localStorage.getItem('mystate');
        if (state) {
          state = JSON.parse(state);
        }
        return state;
      },
    },
    focusedRowEnabled: true,
    focusedRowKey: 90,
  });

  test('Focused row should be shown after reloading the page (T1058983)', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).localStorage.removeItem('mystate');
    });
    await createWidget(page, 'dxTreeList', getTreeListConfig());

    await page.waitForTimeout(1000);

    const focusedRow = page.locator('#container .dx-row-focused');
    await expect(focusedRow).toBeVisible();

    await page.evaluate(() => ($('#container') as any).dxTreeList('instance').getScrollable().scrollTo({ top: 0 }));
    await page.waitForTimeout(300);

    const scrollTop = await page.evaluate(() => ($('#container') as any).dxTreeList('instance').getScrollable().scrollTop());
    expect(scrollTop).toBe(0);

    await page.evaluate(() => location.reload());
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
    await createWidget(page, 'dxTreeList', getTreeListConfig());
    await page.waitForTimeout(1000);

    const focusedRowAfterReload = page.locator('#container .dx-row-focused');
    await expect(focusedRowAfterReload).toBeVisible();

    });

  test('TreeList - Unable to focus a node when deleting the previous node in certain scenarios (T1178893)', async ({ page }) => {

    await page.evaluate(() => {
      (window as any).localStorage.removeItem('mystate');
    });
    const config = getTreeListConfig();
    config.editing = {
      mode: 'row',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
    };
    config.focusedRowKey = 3;

    await createWidget(page, 'dxTreeList', config);

    const treeList = new TreeList(page);
    const focusedRow = page.locator('#container .dx-row-focused');

    await expect(focusedRow).toHaveAttribute('aria-rowindex', '3');

    const deleteButton0 = treeList.getDataRow(2).element.locator('.dx-link-delete').first();
    await deleteButton0.click();

    const confirmButton0 = page.locator('.dx-dialog-button:has-text("Yes")');
    await confirmButton0.click();
    await page.waitForTimeout(300);

    await expect(focusedRow).toHaveAttribute('aria-rowindex', '3');

    const deleteButton1 = treeList.getDataRow(2).element.locator('.dx-link-delete').first();
    await deleteButton1.click();

    const confirmButton1 = page.locator('.dx-dialog-button:has-text("Yes")');
    await confirmButton1.click();
    await page.waitForTimeout(300);

    await expect(focusedRow).toHaveAttribute('aria-rowindex', '3');
    await expect(treeList.getDataCell(2, 0)).toContainText('5');

    });
});
