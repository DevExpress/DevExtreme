import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Treelist - Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1247158
  test('TreeList - Insertafterkey doesn\'t work on children nodes', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [
      {
        ID: 1,
        Head_ID: -1,
        Full_Name: 'John Heart',
      },
      {
        ID: 2,
        Head_ID: 1,
        Full_Name: 'Samantha Bright',
      },
    ],
    rootValue: -1,
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    columns: ['Full_Name'],
    editing: {
      mode: 'batch',
      allowAdding: true,
      allowUpdating: true,
      useIcons: true,
    },
    focusedRowEnabled: true,
    expandedRowKeys: [1],
    onKeyDown(e) {
      if (e.event.ctrlKey && e.event.key === 'Enter') {
        const currentSelectedParentTaskId = e.component.getNodeByKey(
          e.component.option('focusedRowKey'),
        )?.parent?.key;
        const key = new (window as any).DevExpress.data.Guid().toString();
        const data = { Head_ID: currentSelectedParentTaskId };
        e.component.option('editing.changes', [
          {
            key,
            type: 'insert',
            insertAfterKey: e.component.option('focusedRowKey'),
            data,
          },
        ]);
      }
    },
  });

    const treeList = page.locator('#container');
    const expectedInsertedRowIndex = 2;

    await treeList.getDataCell(1, 0).element.click()
      .pressKey('ctrl+enter')
      .expect(treeList.getDataRow(expectedInsertedRowIndex).isInserted)
      .ok();

    });
});
