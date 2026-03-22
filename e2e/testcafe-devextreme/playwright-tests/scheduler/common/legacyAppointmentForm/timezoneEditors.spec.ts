import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Layout:AppointmentForm:TimezoneEditors(T1080932)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const dataSource = [{
  text: 'Watercolor Landscape',
  startDate: new Date('2020-06-01T17:30:00.000Z'),
  endDate: new Date('2020-06-01T19:00:00.000Z'),
  recurrenceRule: 'FREQ=WEEKLY',
  startDateTimeZone: 'Etc/GMT+10',
  endDateTimeZone: 'US/Alaska',
}];

const inputClassName = '.dx-texteditor-input';
const startDateTimeZoneValue = '(GMT -10:00) Etc - GMT+10';
const endDateTimeZoneValue = '(GMT -08:00) US - Alaska';

test.skip('TimeZone editors should be have data after hide forms data(T1080932)', async ({ page }) => {
  // Scheduler on '#container'
  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (page.locator('.dx-scheduler-appointment').nth(0).dblclick().element);

  const startDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(1);
  expect(startDateTimeZone.value).toBe(startDateTimeZoneValue);

  const endDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(3);
  expect(endDateTimeZone.value).toBe(endDateTimeZoneValue);
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
    dataSource,
    onAppointmentFormOpening: (e) => {
      e.form.itemOption('mainGroup.text', 'visible', false);
    },
    editing: {
      allowTimeZoneEditing: true,
      legacyForm: true,
    },
    recurrenceEditMode: 'series',
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 6, 25),
    startDayHour: 9,
    height: 600,
  });
});

test.skip('TimeZone editors should be have data in default case(T1080932)', async ({ page }) => {
  // Scheduler on '#container'

  await (page.locator('.dx-scheduler-appointment').nth(0).dblclick().element);

  const { legacyAppointmentPopup: appointmentPopup } = scheduler;

  await (page.locator('.dx-scheduler-appointment').nth(0).dblclick().element);

  const startDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(2);
  expect(startDateTimeZone.value).toBe(startDateTimeZoneValue);

  const endDateTimeZone = appointmentPopup.wrapper.find(inputClassName).nth(4);
  expect(endDateTimeZone.value).toBe(endDateTimeZoneValue);
});

// TODO: .before() block not converted - move to test setup
// {
  await createWidget(page, 'dxScheduler', {
    dataSource,
    editing: {
      allowTimeZoneEditing: true,
      legacyForm: true,
    },
    recurrenceEditMode: 'series',
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2020, 6, 25),
    startDayHour: 9,
    height: 600,
  });
});
});
