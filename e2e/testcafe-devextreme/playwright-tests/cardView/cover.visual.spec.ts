import { test } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../tests/container.html');

test.describe('CardView - Cover', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('default render', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      width: 1000,
      height: 600,
      columns: ['Customer', 'Order Date'],
      cardCover: {
        imageExpr: (data) => data.Picture && `../../../apps/demos/${data.Picture}`,
        altExpr: 'FirstName',
      },
      dataSource: [
        { ID: 1, FirstName: 'John', LastName: 'Heart', Picture: 'images/employees/01.png' },
        { ID: 2, FirstName: 'Olivia', LastName: 'Peyton' },
        { ID: 3, FirstName: 'Robert', LastName: 'Reagan', Picture: 'images/employees/03.png' },
      ],
    });

    await testScreenshot(page, 'cover-default-render.png', {
      element: page.locator('#container'),
    });
  });
});
