import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const columns = ['id', 'title', 'name', 'lastName'];
const data = [
  { id: 1, title: 'Mr.', name: 'John', lastName: 'Heart' },
  { id: 2, title: 'Mrs.', name: 'Olivia', lastName: 'Peyton' },
  { id: 3, title: 'Mr.', name: 'Robert', lastName: 'Reagan' },
  { id: 4, title: 'Mr.', name: 'Greta', lastName: 'Sims' },
];

const baseConfig = {
  columns,
  dataSource: data,
  keyExpr: 'id',
  editing: {
    allowUpdating: true,
    allowDeleting: true,
    allowAdding: true,
  },
};

test.describe('CardView - Editing Visual', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('default render', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', baseConfig);

    await testScreenshot(page, 'editing-default-render.png', {
      element: page.locator('#container'),
    });
  });

  test('render of add card popup', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', baseConfig);

    await page.locator('.dx-cardview-addcard-button').click();

    await testScreenshot(page, 'editing-popup-add.png', {
      element: page.locator('#container'),
    });
  });

  test('render of edit card popup', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', baseConfig);

    await page.locator('.dx-cardview-card').first().locator('.dx-toolbar-item').first().click();

    await testScreenshot(page, 'editing-popup-edit.png', {
      element: page.locator('#container'),
    });
  });
});
