import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: needs DataGrid page object (DataGrid, EditForm, CellEditor, DataCell, GridsEditMode)
test.describe('Editing.FunctionalMatrix', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Update cell value, mode: cell, repaintChangesOnly: true, useKeyboard: false, useMask: false', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });

  test.skip('Update cell value, mode: row, repaintChangesOnly: false, useKeyboard: false, useMask: false', async ({ page }) => {
    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
  });
});
