import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const COLUMN_CHOOSER_ITEM_SELECTOR = '.dx-cardview-column-chooser .dx-treeview-item';

async function triggerDragStart(page: import('@playwright/test').Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel) as Element;
    const left = element.getBoundingClientRect().left + 5;
    const top = element.getBoundingClientRect().top + 5;
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: left, clientY: top }));
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: left, clientY: top + 30 }));
  }, selector);
}

async function triggerDragEnd(page: import('@playwright/test').Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel) as Element;
    const { top, left } = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: left, clientY: top }));
  }, selector);
}

test.describe('CardView - ColumnSortable.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test.skip('headerPanel dragging column when it has sorting and headerFilter', async ({ page }) => {
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

  test('dropzone appear in headerPanel when drag from columnChooser a column', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      allowColumnReordering: true,
      columnChooser: { enabled: true },
      height: 600,
      columns: [{ dataField: 'Column 1', visible: false }],
    });

    await page.evaluate(() => {
      (window as any).$('#container').dxCardView('instance').showColumnChooser();
    });
    await page.waitForSelector(COLUMN_CHOOSER_ITEM_SELECTOR);

    await triggerDragStart(page, COLUMN_CHOOSER_ITEM_SELECTOR);
    await page.waitForTimeout(500);
    await testScreenshot(page, 'card-view_column-sortable_empty-header-panel_dropzone_1.png', {
      element: page.locator('#container'),
    });

    await triggerDragEnd(page, COLUMN_CHOOSER_ITEM_SELECTOR);
    await page.waitForTimeout(500);
    await testScreenshot(page, 'card-view_column-sortable_empty-header-panel_dropzone_2.png', {
      element: page.locator('#container'),
    });
  });

  test('dropzone appears in headerPanel when drag from columnChooser a column with allowReordering: false', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      allowColumnReordering: true,
      columnChooser: { enabled: true },
      height: 600,
      columns: [
        { dataField: 'Column 1' },
        { dataField: 'Column 2', visible: false, allowReordering: false },
      ],
    });

    await page.evaluate(() => {
      (window as any).$('#container').dxCardView('instance').showColumnChooser();
    });
    await page.waitForSelector(COLUMN_CHOOSER_ITEM_SELECTOR);

    await triggerDragStart(page, COLUMN_CHOOSER_ITEM_SELECTOR);
    await page.waitForTimeout(500);
    await testScreenshot(page, 'card-view_column-sortable_header-panel_dropzone_1.png', {
      element: page.locator('#container'),
    });

    await triggerDragEnd(page, COLUMN_CHOOSER_ITEM_SELECTOR);
    await page.waitForTimeout(500);
    await testScreenshot(page, 'card-view_column-sortable_header-panel_dropzone_2.png', {
      element: page.locator('#container'),
    });
  });
});
