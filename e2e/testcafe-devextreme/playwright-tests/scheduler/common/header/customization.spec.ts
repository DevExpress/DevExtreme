import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const customToolbarItems = [
  {
    location: 'before',
    name: 'dateNavigator',
    options: {
      items: [
        { key: 'today', text: 'Today' },
        'prev',
        'next',
        'dateInterval',
      ],
    },
  },
  {
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    options: { icon: 'plus' },
  },
  'viewSwitcher',
];

test.describe('Scheduler header customization', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Scheduler default toolbar should works', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
    });

    await testScreenshot(page, 'scheduler-default toolbar.png', {
      element: page.locator('.dx-scheduler-header'),
    });
  });

  test('Scheduler toolbar should be hided', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 3, 27),
      toolbar: {
        visible: false,
        items: [
          { location: 'before', name: 'viewSwitcher' },
          { location: 'after', name: 'dateNavigator' },
        ],
      },
    });

    await expect(page.locator('.dx-scheduler-header')).not.toBeVisible();

    await testScreenshot(page, 'scheduler-hidden-toolbar.png', {
      element: page.locator('.dx-scheduler'),
    });
  });

  [
    { toolbar: { items: customToolbarItems }, description: 'custom toolbar' },
    { toolbar: { items: ['today', 'dateNavigator', 'viewSwitcher'] }, description: 'toolbar with today' },
    { toolbar: { disabled: true, items: customToolbarItems }, description: 'disabled toolbar' },
  ].forEach(({ toolbar, description }) => {
    test(`Scheduler ${description} should works`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: new Date(2021, 3, 27),
        toolbar,
      });

      await testScreenshot(page, `scheduler-${description}.png`, {
        element: page.locator('.dx-scheduler-header'),
      });
    });
  });
});
