import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Public methods', () => {
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
      items.push({ key: `item_${i}`, parentKey: null });

      for (let j = 0; j < 100; j += 1) {
        items.push({ key: `item_${i}_${j}`, parentKey: `item_${i}` });
      }
    }

    return items;
  };

  [true, false].forEach((renderAsync) => {
    [true, false].forEach((useNativeScrolling) => {
      test.skip(`The renderAsync=${renderAsync} and scrolling.useNative=${useNativeScrolling}: The navigateToRow method should work correctly when there are asynchronous cell templates and virtual scrolling is enabled (T1275775)`, async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
        dataSource: getItems(),
        height: 500,
        width: 500,
        dataStructure: 'plain',
        parentIdExpr: 'parentKey',
        keyExpr: 'key',
        renderAsync,
        scrolling: {
          mode: 'virtual',
          useNaive: useNativeScrolling,
        },
        templatesRenderAsynchronously: true,
        columns: [{
          dataField: 'key',
          cellTemplate: 'testCellTemplate',
        }],
        integrationOptions: {
          templates: {
            testCellTemplate: {
              render({ model, container, onRendered }) {
                setTimeout(() => {
                  container.append($('<span/>').text(model.value));
                  onRendered();
                }, 100);
              },
            },
          },
        },
      });

        // arrange
        const treeList = page.locator('#container');

        await page.expect(treeList.getDataCell(0, 0).element.textContent)
          .contains('item_');

        // act
        await treeList.apiNavigateToRow('item_80_50');

        // assert
        await page.expect(treeList.getDataCell(131, 0).element.textContent)
          .contains('item_');

        await testScreenshot(page, `T1275775-navigateToRow-with-async-cell-templates_(renderAsync=${renderAsync}_useNativeScrolling=${useNativeScrolling}).png`, { element: treeList.element });

    });
    });
  });
});
