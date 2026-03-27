import { test, expect } from '@playwright/test';
import { createWidget } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Adaptive Row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should be shown and hidden when the window is resized', async ({ page }) => {
    await createWidget(page, 'dxTreeList', {
    dataSource: [{
      ID: 1,
      Head_ID: -1,
      Full_Name: 'John Heart',
      Prefix: 'Mr.',
      Title: 'CEO',
      City: 'Los Angeles',
      State: 'California',
      Email: 'jheart@dx-email.com',
      Skype: 'jheart_DX_skype',
      Mobile_Phone: '(213) 555-9392',
      Birth_Date: '1964-03-16',
      Hire_Date: '1995-01-15',
    }],
    keyExpr: 'ID',
    parentIdExpr: 'Head_ID',
    rootValue: -1,
    allowColumnResizing: true,
    rowDragging: {
      allowDropInsideItem: true,
      allowReordering: true,
    },
    columns: [
      {
        dataField: 'Title',
        caption: 'Position',
        hidingPriority: 0,
        fixed: true,
      },
      { dataField: 'Full_Name', hidingPriority: 1 },
      { dataField: 'City', hidingPriority: 2 },
      { dataField: 'State', hidingPriority: 3 },
      { dataField: 'Mobile_Phone', hidingPriority: 4 },
      { dataField: 'Hire_Date', dataType: 'date', hidingPriority: 5 },
    ],
  });

    const adaptiveButton = page.locator('#container .dx-command-adaptive .dx-datagrid-adaptive-more');
    await expect(adaptiveButton).toBeVisible();
    await adaptiveButton.click();

    const adaptiveRow = page.locator('#container .dx-adaptive-detail-row');
    await expect(adaptiveRow).toBeVisible();

    await page.setViewportSize({ width: 1200, height: 400 });
    await page.waitForTimeout(500);

    const adaptiveColumn = page.locator('#container .dx-command-adaptive');
    await expect(adaptiveColumn).toBeHidden();
    await expect(adaptiveRow).toBeHidden();

    });
});
