import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

async function scrollToDate(page, date: Date, groups?: Record<string, unknown>): Promise<void> {
  await page.evaluate(({ d, g }) => {
    const instance = ($('#container') as any).dxScheduler('instance');
    instance.scrollTo(new Date(d), g);
  }, { d: date.toISOString(), g: groups });
}

test.describe('Scheduler: Virtual Scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Appointment should not repaint after scrolling if present on viewport', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      height: 600,
      width: 800,
      currentDate: new Date(2020, 8, 7),
      scrolling: {
        mode: 'virtual',
        orientation: 'both',
        outlineCount: 0,
      },
      currentView: 'week',
      views: [{
        type: 'week',
        intervalCount: 10,
      }],
      dataSource: [{
        startDate: new Date(2020, 8, 13, 2),
        endDate: new Date(2020, 8, 13, 3),
        text: 'test',
      }],
    });

    const appointment = page.locator('.dx-scheduler-appointment').nth(0);
    await expect(appointment).toBeVisible();

    await appointment.evaluate((el) => {
      el.style.backgroundColor = 'red';
    });

    const styleBefore = await appointment.getAttribute('style');
    expect(styleBefore).toContain('background-color: red');

    await scrollToDate(page, new Date(2020, 8, 17, 4));

    const styleAfter = await appointment.getAttribute('style');
    expect(styleAfter).toContain('background-color: red');
  });

  test('The appointment should render correctly when scrolling vertically (T1263428)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      height: 500,
      width: 900,
      timeZone: 'Europe/Vienna',
      dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssxx',
      currentDate: new Date(2024, 10, 11, 20, 54, 23, 361),
      cellDuration: 20,
      firstDayOfWeek: 1,
      startDayHour: 12.0,
      endDayHour: 18.0,
      allDayPanelMode: 'hidden',
      scrolling: {
        mode: 'virtual',
      },
      crossScrollingEnabled: true,
      currentView: 'week',
      textExpr: 'Subject',
      startDateExpr: 'StartDate',
      endDateExpr: 'EndDate',
      views: [{
        type: 'week',
        groupByDate: true,
        startDayHour: 6.0,
        endDayHour: 22.0,
      }],
      dataSource: [{
        Subject: 'Website Re-Design Plan',
        StartDate: new Date('2024-11-11T12:10:00+0100'),
        EndDate: new Date('2024-11-12T21:00:00+0100'),
      }],
    });

    await scrollToDate(page, new Date('2024-11-12T09:00:00+0100'));

    const scheduler = page.locator('.dx-scheduler');
    await testScreenshot(page, 'T1263428-virtual-scrolling-render-appointment.png', {
      element: scheduler,
    });
  });
});
