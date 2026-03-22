import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('CardView - ColumnSortable.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('headerPanel dragging column when it has sorting and headerFilter', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      allowColumnReordering: true,
      columnChooser: { enabled: true },
      headerFilter: { visible: true },
      columns: [{
        dataField: 'test',
        allowReordering: true,
        sortOrder: 'asc',
      }],
    });

    await page.evaluate(() => {
      const element = document.querySelector('.dx-cardview-headers .dx-cardview-header-item') as Element;
      const left = element.getBoundingClientRect().left + 5;
      const top = element.getBoundingClientRect().top + 5;
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: left, clientY: top }));
      element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: left, clientY: top + 30 }));
    });

    await testScreenshot(page, 'card-view_column-sortable_header-panel_dragging-column.png', {
      element: page.locator('#container'),
    });
  });
});
