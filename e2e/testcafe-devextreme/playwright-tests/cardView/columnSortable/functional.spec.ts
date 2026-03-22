import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('CardView - ColumnSortable.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [
    { allowColumnReordering: false, allowReordering: false, result: false },
    { allowColumnReordering: false, allowReordering: true, result: false },
    { allowColumnReordering: true, allowReordering: false, result: false },
    { allowColumnReordering: true, allowReordering: true, result: true },
  ].forEach(({ allowColumnReordering, allowReordering, result }) => {
    test(`header column is draggable: ${result}, when allowColumnReordering: ${allowColumnReordering}, allowReordering: ${allowReordering}`, async ({ page }) => {
      await createWidget(page, 'dxCardView', {
        allowColumnReordering,
        columns: [{
          dataField: 'test',
          allowReordering,
        }],
      });

      const columnElement = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();

      await page.evaluate((selector) => {
        const element = document.querySelector(selector) as Element;
        const left = element.getBoundingClientRect().left + 5;
        const top = element.getBoundingClientRect().top + 5;
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: left, clientY: top }));
        element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: left, clientY: top + 30 }));
      }, '.dx-cardview-headers .dx-cardview-header-item');

      const dragging = page.locator('.dx-sortable-dragging');
      if (result) {
        await expect(dragging).toBeVisible();
      } else {
        await expect(dragging).not.toBeVisible();
      }
    });
  });
});
