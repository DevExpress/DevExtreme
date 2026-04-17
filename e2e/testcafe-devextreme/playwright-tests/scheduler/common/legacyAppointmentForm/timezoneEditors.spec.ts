import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const dataSource = [{
  text: 'Watercolor Landscape',
  startDate: new Date('2020-06-01T17:30:00.000Z'),
  endDate: new Date('2020-06-01T19:00:00.000Z'),
  recurrenceRule: 'FREQ=WEEKLY',
  startDateTimeZone: 'Etc/GMT+10',
  endDateTimeZone: 'US/Alaska',
}];

test.describe.skip('Layout:AppointmentForm:TimezoneEditors(T1080932)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('TimeZone editors should be have data after hide forms data(T1080932)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource,
      onAppointmentFormOpening: ((e: any) => {
        e.form.itemOption('mainGroup.text', 'visible', false);
      }) as any,
      editing: { allowTimeZoneEditing: true, legacyForm: true },
      recurrenceEditMode: 'series',
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2020, 6, 25),
      startDayHour: 9,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').nth(0);
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const inputs = popup.locator('.dx-texteditor-input');
    const startTzValue = await inputs.nth(1).inputValue();
    expect(startTzValue).toBe('(GMT -10:00) Etc - GMT+10');
  });

  test('TimeZone editors should be have data in default case(T1080932)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource,
      editing: { allowTimeZoneEditing: true, legacyForm: true },
      recurrenceEditMode: 'series',
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2020, 6, 25),
      startDayHour: 9,
      height: 600,
    });

    const appointment = page.locator('.dx-scheduler-appointment').nth(0);
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const inputs = popup.locator('.dx-texteditor-input');
    const startTzValue = await inputs.nth(2).inputValue();
    expect(startTzValue).toBe('(GMT -10:00) Etc - GMT+10');
  });
});
