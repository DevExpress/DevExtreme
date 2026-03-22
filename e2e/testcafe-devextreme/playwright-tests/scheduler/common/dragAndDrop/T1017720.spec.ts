import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('T1017720', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Drag-n-drop appointment above SVG element(T1017720)', async ({ page }) => {
  // Scheduler on '#scheduler'
    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'text' });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(330, 0) */;

  await testScreenshot(page, 'drag-n-drop-to-right(T1017720).png', { element: page.locator('.dx-scheduler-work-space') });

  await /* TODO: drag */ await (draggableAppointment.element).click() /* drag(-330, 70) */;

  await testScreenshot(page, 'drag-n-drop-to-left(T1017720).png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxChart', extend({
    width: '100%',
    height: 1300,
    series: {
      type: 'bar',
      color: '#ffaa66',
    },
  }));

  await createWidget(page, 'dxPopup', extend({
    width: '90%',
    height: '90%',
    visible: true,
    contentTemplate: ClientFunction(() => {
      const scheduler = $('<div id="scheduler" />');

      (scheduler as any).dxScheduler({
        width: '100%',
        height: '100%',
        startDayHour: 11,
        dataSource: [{
          text: 'text',
          startDate: new Date(2021, 6, 27, 11),
          endDate: new Date(2021, 6, 27, 14),
          allDay: false,
        }],
        views: ['week'],
        currentDate: new Date(2021, 6, 27, 12),
        currentView: 'week',
      });

      return scheduler;
    }),
  }));
});
});
