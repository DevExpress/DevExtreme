import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Agenda:Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Tooltip\'s date should be equal to date of current appointment(T1037028)', async ({ page }) => {
  // Scheduler on '#container'
  const appointmentName = 'Text';

  for (let index = 0; index < 5; index += 1) {
    await scheduler.hideAppointmentTooltip();

    await (scheduler.getAppointment(appointmentName, index).click().element);

    const tooltipDate = await scheduler.appointmentTooltip
      .getListItem(appointmentName, 0).date.innerText;
    const expectedDate = await scheduler.getAppointment(appointmentName, index).date.time;

    expect(tooltipDate).toBe(expectedDate);
  }
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
    dataSource: [{
      text: 'Text',
      startDate: new Date(2021, 1, 1, 12),
      endDate: new Date(2021, 1, 1, 13),
      recurrenceRule: 'FREQ=HOURLY;COUNT=5',
    }],
    views: ['agenda'],
    currentView: 'agenda',
    currentDate: new Date(2021, 1, 1),
    height: 600,
  });
});
});
