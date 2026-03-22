import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sticky columns - Drag and Drop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const DATA_GRID_SELECTOR = '#container';

  test('Fixed columns should work when drag and drop rows are enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: getData(10, 10),
    keyExpr: 'field_0',
    width: 500,
    columnFixing: {
      enabled: true,
    },
    showColumnHeaders: true,
    columnAutoWidth: true,
    rowDragging: {
      allowReordering: true,
      dropFeedbackMode: 'push',
    },
    customizeColumns(columns) {
      columns[5].fixed = true;
      columns[6].fixed = true;

      columns[8].fixed = true;
      columns[8].fixedPosition = 'right';
      columns[9].fixed = true;
      columns[9].fixedPosition = 'right';
    },
  });

    // arrange, act
    const treeList = new TreeList(DATA_GRID_SELECTOR);

    await testScreenshot(page, 'treelist_sticky_columns_with_drag_and_drop_before_interaction.png', { element: treeList.element });

    // assert

    });
});
