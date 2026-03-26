import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('CardView - Editing', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('should show default values in popup fields after onInitNewCard', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: [
        { dataField: 'id', caption: 'ID' },
        { dataField: 'title', caption: 'Task Title' },
        { dataField: 'status', caption: 'Status' },
      ],
      dataSource: [],
      keyExpr: 'id',
      editing: {
        allowAdding: true,
        form: { items: ['id', 'title', 'status'] },
      },
      onInitNewCard(e) {
        e.data.id = 10;
        e.data.status = 'Not Started';
        e.data.title = 'New Task';
      },
    });

    await page.locator('[aria-label="add"]').click();
    await page.waitForSelector('.dx-popup-normal');

    const idInput = page.locator('.dx-popup-normal input[name="id"]');
    const titleInput = page.locator('.dx-popup-normal input[name="title"]');
    const statusInput = page.locator('.dx-popup-normal input[name="status"]');

    await expect(idInput).toHaveValue('10');
    await expect(titleInput).toHaveValue('New Task');
    await expect(statusInput).toHaveValue('Not Started');
  });
});
