import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Row dragging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const tasksT1228650 = [{
    Task_ID: 1,
    Task_Subject: 'Plans 2015',
    Task_Parent_ID: 0,
  }, {
    Task_ID: 2,
    Task_Subject: 'Health Insurance',
    Task_Parent_ID: 1,
  }, {
    Task_ID: 3,
    Task_Subject: 'Training',
    Task_Parent_ID: 2,
  }];

  test.skip('TreeList - Expand/collapse mechanism breaks after dragging action in the space between the last row and the border (T1228650)', async ({ page }) => {

    await createWidget(page, 'dxTreeList', {
      dataSource: tasksT1228650,
      keyExpr: 'Task_ID',
      parentIdExpr: 'Task_Parent_ID',
      height: 200,
      wordWrapEnabled: true,
      showBorders: true,
      columnFixing: {
        legacyMode: true,
      },
      columns: [
        {
          dataField: 'test',
          dataType: 'boolean',
        },
        {
          dataField: 'Task_Subject',
          fixed: true,
          fixedPosition: 'right',
        },
      ],
      showColumnLines: true,
      rowDragging: {
        allowDropInsideItem: true,
        allowReordering: false,
        showDragIcons: false,
        group: 'none',
      },
    });

    const treeList = page.locator('#container');
    const dataRow = treeList.getDataRow(0);
    const expandButton = new ExpandableCell(dataRow.getDataCell(0)).getExpandButton();
    const freeSpaceRow = treeList.getFreeSpaceRow();
    await page.dragToElement(freeSpaceRow, dataRow.element)
      .click(expandButton)
      .expect(treeList.getDataRow(1).element.exists)
      .ok();

    });

  [undefined, 200].forEach((height) => {
    test.skip(`TreeList - The W1025 warning occurs when dragging a row (height: ${height ?? 'not set'}). (T1280519)`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height,
      scrolling: {
        mode: 'virtual',
      },
      dataSource: tasksT1228650,
      rowDragging: {
        allowReordering: true,
      },
    });

      const treeList = page.locator('#container');

      await treeList.isReady();

      await treeList.moveRow(0, 10, 10, true);

      await page.waitForTimeout(100);

      const consoleMessages = await getBrowserConsoleMessages();
      const warningExists = !!consoleMessages?.warn.find((message) => message.startsWith('W1025'));

      expect(warningExists).toBe(height === undefined);

    });
  });
});
