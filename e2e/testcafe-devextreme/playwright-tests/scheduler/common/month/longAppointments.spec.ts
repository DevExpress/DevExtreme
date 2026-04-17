import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler: long appointments in month view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const appointments = [
    {
      text: 'Appointment spans 3 rows',
      startDate: new Date(2020, 0, 6),
      endDate: new Date(2020, 0, 24),
    },
    {
      text: 'Appointment spans all rows',
      startDate: new Date(2019, 11, 29),
      endDate: new Date(2020, 1, 8, 15),
    },
    {
      text: 'Appointment spans 2 rows',
      startDate: new Date(2020, 0, 17),
      endDate: new Date(2020, 0, 20),
    },
  ];

  for (const rtlEnabled of [false, true]) {
    for (const appointment of appointments) {
      test(`Long appointment should display valid on month view(rtl='${rtlEnabled}', text='${appointment.text}')`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: [appointment],
          views: ['month'],
          currentView: 'month',
          rtlEnabled,
          currentDate: new Date(2020, 0, 1),
        });

        await testScreenshot(page,
          `month-long-appointment(rtl=${rtlEnabled}, text=${appointment.text}).png`,
          { element: page.locator('.dx-scheduler-work-space') },
        );
      });
    }
  }

  for (const rtlEnabled of [false, true]) {
    test(`Long appointment(several months) should display valid on month view(rtl='${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'Text',
          startDate: new Date(2020, 0, 6),
          endDate: new Date(2020, 2, 10),
        }],
        views: ['month'],
        currentView: 'month',
        rtlEnabled,
        currentDate: new Date(2020, 0, 1),
      });

      const workSpace = page.locator('.dx-scheduler-work-space');

      await testScreenshot(page,
        `month-long-appointment-several-months-january(rtl=${rtlEnabled}).png`,
        { element: workSpace },
      );

      await page.locator('.dx-scheduler-navigator-next').click();
      await page.waitForTimeout(300);

      await testScreenshot(page,
        `month-long-appointment-several-months-february(rtl=${rtlEnabled}).png`,
        { element: workSpace },
      );

      await page.locator('.dx-scheduler-navigator-next').click();
      await page.waitForTimeout(300);

      await testScreenshot(page,
        `month-long-appointment-several-months-march(rtl=${rtlEnabled}).png`,
        { element: workSpace },
      );
    });
  }

  test('Long recurrence appointment should display valid on month view', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Text',
        startDate: new Date(2020, 0, 6),
        endDate: new Date(2020, 0, 10),
        recurrenceRule: 'FREQ=DAILY;INTERVAL=5',
      }],
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2020, 0, 1),
    });

    const workSpace = page.locator('.dx-scheduler-work-space');

    await testScreenshot(page,
      'month-long-recurrence-appointment-several-months-january.png',
      { element: workSpace },
    );

    await page.locator('.dx-scheduler-navigator-next').click();
    await page.waitForTimeout(300);

    await testScreenshot(page,
      'month-long-recurrence-appointment-several-months-february.png',
      { element: workSpace },
    );
  });
});
