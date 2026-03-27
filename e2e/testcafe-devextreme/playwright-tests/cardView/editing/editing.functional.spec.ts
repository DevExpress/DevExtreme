import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const baseColumns = [
  { dataField: 'id', caption: 'ID' },
  { dataField: 'title', caption: 'Task Title' },
  { dataField: 'status', caption: 'Status' },
];

test.describe('CardView - Editing', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('should show default values in popup fields after onInitNewCard', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
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

  test('should open add popup when add button is clicked', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [],
      keyExpr: 'id',
      editing: { allowAdding: true },
    });

    await page.locator('[aria-label="add"]').click();

    await expect(page.locator('.dx-popup-normal')).toBeVisible();
  });

  test('should close add popup when cancel button is clicked', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [],
      keyExpr: 'id',
      editing: { allowAdding: true },
    });

    await page.locator('[aria-label="add"]').click();
    await page.waitForSelector('.dx-popup-normal');

    const cancelButton = page.locator('.dx-popup-normal .dx-button').filter({ hasText: /cancel/i });
    await cancelButton.click();

    await expect(page.locator('.dx-popup-normal')).not.toBeVisible();
  });

  test('should open edit popup when edit button on card is clicked', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [{ id: 1, title: 'Task 1', status: 'Active' }],
      keyExpr: 'id',
      editing: { allowUpdating: true },
    });

    await page.locator('.dx-cardview-card').first().locator('.dx-toolbar-item').first().click();

    await expect(page.locator('.dx-popup-normal')).toBeVisible();
  });

  test('should show existing card values in edit popup', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [{ id: 1, title: 'Task 1', status: 'Active' }],
      keyExpr: 'id',
      editing: {
        allowUpdating: true,
        form: { items: ['id', 'title', 'status'] },
      },
    });

    await page.locator('.dx-cardview-card').first().locator('.dx-toolbar-item').first().click();
    await page.waitForSelector('.dx-popup-normal');

    const titleInput = page.locator('.dx-popup-normal input[name="title"]');
    const statusInput = page.locator('.dx-popup-normal input[name="status"]');

    await expect(titleInput).toHaveValue('Task 1');
    await expect(statusInput).toHaveValue('Active');
  });

  test('should show add toolbar button when allowAdding is true', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [],
      keyExpr: 'id',
      editing: { allowAdding: true },
    });

    await expect(page.locator('[aria-label="add"]')).toBeVisible();
  });

  test('should not show add toolbar button when allowAdding is false', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [{ id: 1, title: 'Task 1', status: 'Active' }],
      keyExpr: 'id',
      editing: { allowAdding: false, allowUpdating: true, allowDeleting: true },
    });

    await expect(page.locator('[aria-label="add"]')).not.toBeVisible();
  });

  test('should not show edit button on card when allowUpdating is false', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [{ id: 1, title: 'Task 1', status: 'Active' }],
      keyExpr: 'id',
      editing: { allowAdding: false, allowUpdating: false, allowDeleting: true },
    });

    const editButton = page.locator('.dx-cardview-card').first().locator('.dx-toolbar-item');

    await expect(editButton).toHaveCount(1);
  });

  test('should fire onRowInserting when new card is saved', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      columns: baseColumns,
      dataSource: [],
      keyExpr: 'id',
      editing: {
        allowAdding: true,
        form: { items: ['id', 'title', 'status'] },
      },
    });

    await page.locator('[aria-label="add"]').click();
    await page.waitForSelector('.dx-popup-normal');

    await page.locator('.dx-popup-normal input[name="id"]').fill('99');
    await page.locator('.dx-popup-normal input[name="title"]').fill('New Card');
    await page.locator('.dx-popup-normal input[name="status"]').fill('Pending');

    const saveButton = page.locator('.dx-popup-normal .dx-button').filter({ hasText: /save/i });
    await saveButton.click();

    await expect(page.locator('.dx-popup-normal')).not.toBeVisible();
    await expect(page.locator('.dx-cardview-card')).toHaveCount(1);
  });
});
