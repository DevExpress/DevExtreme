import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DataGrid from '../../../models/dataGrid';

const setToastDisplayTime = (page: Page, displayTime: number): Promise<void> => page.evaluate(
  (time) => {
    (window as any).DevExpress.ui.dxToast.defaultOptions({
      options: {
        displayTime: time,
      },
    });
  },
  displayTime,
);

test.describe('Toasts in DataGrid', () => {
  test('Toast should be visible after calling and should be not visible after default display time', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {});

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);
    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await setToastDisplayTime(page, 100000);
    await dataGrid.apiShowErrorToast();

    await expect(dataGrid.getToast()).toBeAttached();
    await testScreenshot(page, 'ai-column__toast__at-the-right-position.png', { element: dataGrid.element });
  });

  test('Toast should hide after the display time', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {});

    const dataGrid = new DataGrid(page, DEFAULT_SELECTOR);

    await expect.poll(() => dataGrid.isReady()).toBe(true);

    await setToastDisplayTime(page, 1000);
    await dataGrid.apiShowErrorToast();
    await expect(dataGrid.getToast()).toBeAttached();

    // The toast hides when its display time is over.
    await expect(dataGrid.getToast()).not.toBeAttached();
  });
});
