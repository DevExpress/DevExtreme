import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Row dragging.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  /* eslint-disable @typescript-eslint/no-misused-promises */

  const CLASS = { ...DataGridClassNames, ...ClassNames };

  const isPlaceholderVisible = ClientFunction(() => $(`.${CLASS.sortablePlaceholder}`).is(':visible'), { dependencies: { CLASS } });

  const getPlaceholderOffset = ClientFunction(() => $(`.${CLASS.sortablePlaceholder}`).offset(), { dependencies: { CLASS } });

  const getRowsViewLeftOffset = ClientFunction(() => $(`#container .${CLASS.dataGridRowsView}`).offset()?.left, { dependencies: { CLASS } });

  const getDraggingElementLeftOffset = ClientFunction(() => $(`.${CLASS.sortableDragging}`).offset()?.left, { dependencies: { CLASS } });

  const getDraggingElementScrollPosition = ClientFunction(() => {
    const $dataGrid = $(`.${CLASS.sortableDragging}`).find(`.${CLASS.dataGrid}`).first().parent();
    const dataGridInstance = $dataGrid.data('dxDataGrid');
    const scrollableInstance = dataGridInstance.getScrollable();

    return {
      left: scrollableInstance.scrollLeft(),
      top: scrollableInstance.scrollTop(),
    };
  }, { dependencies: { CLASS } });

  const getFreeSpaceRowOffset = ClientFunction(() => {
    const $freeSpaceRow = $('#container').find(`.${CLASS.dataGridRowsView} table .${CLASS.freeSpaceRow}`).first();

    return $freeSpaceRow?.offset();
  }, { dependencies: { CLASS } });

  const scrollTo = ClientFunction((x, y) => {
    window.scrollTo(x, y);
  });

  const generateData = (rowCount, columnCount): Record<string, unknown>[] => {
    const items: Record<string, unknown>[] = [];

    for (let i = 0; i < rowCount; i += 1) {
      const item = {};

      for (let j = 0; j < columnCount; j += 1) {
        item[`field${j + 1}`] = `${i + 1}-${j + 1}`;
      }

      items.push(item);
    }

    return items;
  };

  );

  // T903351

  test('The placeholder should appear when a cross-component dragging rows after scrolling the window', async ({ page }) => {
    await t.maximizeWindow();
      await page.evaluate(() => {
        $('body').css('display', 'flex');
        $('#container, #otherContainer').css({
          display: 'inline-block',
          'margin-top': '800px',
          width: '50%',
        });
      });

      return Promise.all([
        createWidget(page, 'dxDataGrid', {
          width: 400,
          dataSource: [
            {
              id: 1, name: 'Name 1', age: 19,
            },
            {
              id: 2, name: 'Name 2', age: 11,
            },
            {
              id: 3, name: 'Name 3', age: 15,
            },
            {
              id: 4, name: 'Name 4', age: 16,
            },
            {
              id: 5, name: 'Name 5', age: 25,
            },
            {
              id: 6, name: 'Name 6', age: 18,
            },
            {
              id: 7, name: 'Name 7', age: 21,
            },
            {
              id: 8, name: 'Name 8', age: 14,
            },
          ],
          columns: ['name', 'age'],
          rowDragging: {
            group: 'shared',
          },
        }),
        createWidget(page, 'dxTreeList', {
          columnAutoWidth: true,
          dataSource: [
            {
              id: 1, parentId: 0, name: 'Name 1', age: 19,
            },
            {
              id: 2, parentId: 1, name: 'Name 2', age: 11,
            },
            {
              id: 3, parentId: 0, name: 'Name 3', age: 15,
            },
            {
              id: 4, parentId: 3, name: 'Name 4', age: 16,
            },
            {
              id: 5, parentId: 0, name: 'Name 5', age: 25,
            },
            {
              id: 6, parentId: 5, name: 'Name 6', age: 18,
            },
            {
              id: 7, parentId: 0, name: 'Name 7', age: 21,
            },
            {
              id: 8, parentId: 7, name: 'Name 8', age: 14,
            },
          ],
          autoExpandAll: true,
          columns: ['name', 'age'],
          rowDragging: {
            group: 'shared',
          },
        }, '#otherContainer'),
      ]);

      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    await scrollTo(0, 10000);
    await dataGrid.moveRow(6, 500, 0, true);
    await dataGrid.moveRow(6, 550, 0);

    expect(await isPlaceholderVisible()).toBeTruthy();
  });
});
