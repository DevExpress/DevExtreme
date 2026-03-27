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

    await page.locator('[aria-label="add"]').click();

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

  test('render with allowUpdating only', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      ...baseConfig,
      editing: {
        allowUpdating: true,
        allowDeleting: false,
        allowAdding: false,
      },
    });

    await testScreenshot(page, 'editing-allow-updating-only.png', {
      element: page.locator('#container'),
    });
  });

  test('render with allowDeleting only', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      ...baseConfig,
      editing: {
        allowUpdating: false,
        allowDeleting: true,
        allowAdding: false,
      },
    });

    await testScreenshot(page, 'editing-allow-deleting-only.png', {
      element: page.locator('#container'),
    });
  });

  test('render with allowAdding only', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      ...baseConfig,
      editing: {
        allowUpdating: false,
        allowDeleting: false,
        allowAdding: true,
      },
    });

    await testScreenshot(page, 'editing-allow-adding-only.png', {
      element: page.locator('#container'),
    });
  });

  test('render edit popup for second card', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', baseConfig);

    await page.locator('.dx-cardview-card').nth(1).locator('.dx-toolbar-item').first().click();

    await testScreenshot(page, 'editing-popup-edit-second-card.png', {
      element: page.locator('#container'),
    });
  });

  test('render edit popup for last card', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', baseConfig);

    await page.locator('.dx-cardview-card').last().locator('.dx-toolbar-item').first().click();

    await testScreenshot(page, 'editing-popup-edit-last-card.png', {
      element: page.locator('#container'),
    });
  });

  test('render with custom form items in add popup', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      columns,
      dataSource: data,
      keyExpr: 'id',
      editing: {
        allowAdding: true,
        form: {
          items: ['id', 'title', 'name', 'lastName'],
          colCount: 2,
        },
      },
    });

    await page.locator('[aria-label="add"]').click();

    await testScreenshot(page, 'editing-popup-add-custom-form.png', {
      element: page.locator('#container'),
    });
  });

  test('render with popup title customized', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      columns,
      dataSource: data,
      keyExpr: 'id',
      editing: {
        allowAdding: true,
        allowUpdating: true,
        popup: {
          title: 'Edit Card Record',
          showTitle: true,
        },
      },
    });

    await page.locator('[aria-label="add"]').click();

    await testScreenshot(page, 'editing-popup-custom-title.png', {
      element: page.locator('#container'),
    });
  });

  test('render with editing disabled', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      columns,
      dataSource: data,
      keyExpr: 'id',
      editing: {
        allowUpdating: false,
        allowDeleting: false,
        allowAdding: false,
      },
    });

    await testScreenshot(page, 'editing-all-disabled.png', {
      element: page.locator('#container'),
    });
  });

  test('render with no data and add button visible', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      columns,
      dataSource: [],
      keyExpr: 'id',
      editing: {
        allowAdding: true,
      },
    });

    await testScreenshot(page, 'editing-no-data-with-add-button.png', {
      element: page.locator('#container'),
    });
  });

  test('render add popup on no-data widget', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      columns,
      dataSource: [],
      keyExpr: 'id',
      editing: {
        allowAdding: true,
      },
    });

    await page.locator('[aria-label="add"]').click();

    await testScreenshot(page, 'editing-popup-add-on-empty-widget.png', {
      element: page.locator('#container'),
    });
  });

  test('render with useIcons in editing buttons', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      ...baseConfig,
      editing: {
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: true,
      },
    });

    await testScreenshot(page, 'editing-with-use-icons.png', {
      element: page.locator('#container'),
    });
  });

  test('render with useIcons disabled in editing buttons', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 700 });
    await createWidget(page, 'dxCardView', {
      ...baseConfig,
      editing: {
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: false,
      },
    });

    await testScreenshot(page, 'editing-without-use-icons.png', {
      element: page.locator('#container'),
    });
  });
});
