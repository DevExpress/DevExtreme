import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
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

  const clearLocalStorage = async () => page.evaluate(() => {
    (window as any).localStorage.removeItem('mystate');
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

  test.skip('Focused row should be shown after reloading the page (T1058983)', async ({ page }) => {

    await clearLocalStorage();
    await createWidget(page, 'dxTreeList', getTreeListConfig());

    const treeList = page.locator('#container');

    await page.waitForTimeout(1000);
    let scrollTopPosition = await treeList.getScrollTop();

    // assert
    await page.expect(treeList.isFocusedRowInViewport())
      .ok();

    // act
    await treeList.scrollTo(t, { top: 0 });
    scrollTopPosition = await treeList.getScrollTop();

    // assert
    expect(scrollTopPosition).toBe(0);

    await page.eval(() => location.reload());
    await createWidget(page, 'dxTreeList', getTreeListConfig());
    await page.waitForTimeout(1000);

    scrollTopPosition = await treeList.getScrollTop();

    // assert
    await page.expect(treeList.isFocusedRowInViewport())
      .ok();

    });

  test.skip('TreeList - Unable to focus a node when deleting the previous node in certain scenarios (T1178893)', async ({ page }) => {

    await clearLocalStorage();
    const config = getTreeListConfig();
    config.editing = {
      mode: 'row',
      allowUpdating: true,
      allowAdding: true,
      allowDeleting: true,
    };
    config.focusedRowKey = 3;

    await createWidget(page, 'dxTreeList', config);

    const treeList = page.locator('#container');

    await page.expect(treeList.getFocusedRow().getAttribute('aria-rowindex'))
      .eql('3')

      .click(treeList.getDataRow(2).getCommandCell(2).getButton(2))
      .click(treeList.getConfirmDeletionButton())
      .expect(treeList.getFocusedRow().getAttribute('aria-rowindex'))
      .eql('3')

      .click(treeList.getDataRow(2).getCommandCell(2).getButton(2))
      .click(treeList.getConfirmDeletionButton())
      .expect(treeList.getFocusedRow().getAttribute('aria-rowindex'))
      .eql('3')
      .expect(treeList.getDataRow(2).getDataCell(0).element.textContent)
      .eql('5');

    });
});
