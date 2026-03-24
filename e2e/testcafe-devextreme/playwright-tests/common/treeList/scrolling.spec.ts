import { test, expect } from '@playwright/test';
import { createWidget, TreeList } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The vertical scroll bar of the container\'s parent should not be displayed when the grid has no height, virtual scrolling and state storing are enabled (T1129106)', async ({ page }) => {
    const data = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      parentId: i === 0 ? 0 : 1,
      name: `Item ${i + 1}`,
    }));

    await createWidget(page, 'dxTreeList', {
      dataSource: data,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      scrolling: {
        mode: 'virtual',
      },
      stateStoring: {
        enabled: true,
        type: 'custom',
        customLoad() {
          return {};
        },
        customSave() {},
      },
    });

    const parentContainer = page.locator('#parentContainer');
    const parentScrollHeight = await parentContainer.evaluate(
      (el) => el.scrollHeight,
    );
    const parentClientHeight = await parentContainer.evaluate(
      (el) => el.clientHeight,
    );

    expect(parentScrollHeight).toBeLessThanOrEqual(parentClientHeight + 1);
  });

  test('All items should be selected after select all and scroll down (T1189118)', async ({ page }) => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      parentId: 0,
      name: `Item ${i + 1}`,
    }));

    await createWidget(page, 'dxTreeList', {
      dataSource: data,
      keyExpr: 'id',
      parentIdExpr: 'parentId',
      height: 400,
      scrolling: {
        mode: 'virtual',
      },
      selection: {
        mode: 'multiple',
      },
      columns: ['name'],
    });

    const treeList = new TreeList(page);

    const selectAllCheckbox = page.locator('.dx-treelist-headers .dx-select-checkbox');
    await selectAllCheckbox.click();

    await treeList.scrollTo({ top: 1000 });
    await page.waitForTimeout(500);

    const uncheckedBoxes = page.locator('.dx-treelist-rowsview .dx-select-checkbox:not(.dx-checkbox-checked)');
    const uncheckedCount = await uncheckedBoxes.count();
    expect(uncheckedCount).toBe(0);
  });
});
