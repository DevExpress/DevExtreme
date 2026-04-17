import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, Scheduler } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe.skip('Layout:AppointmentForm:IntegerFormatNumberBox', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('dxNumberBox should not allow to enter not integer chars(T1002864)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 11),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;UNTIL=20220114T205959Z',
      }],
      editing: { legacyForm: true },
      views: ['day', 'week', 'workWeek', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
      recurrenceEditMode: 'series',
    });

    const scheduler = new Scheduler(page);
    const appointment = scheduler.getAppointment('Website Re-Design Plan');
    await appointment.element.dblclick();

    await expect(scheduler.appointmentPopup.element).toBeVisible();

    const repeatEveryInput = page.locator('.dx-recurrence-numberbox .dx-texteditor-input').first();
    await repeatEveryInput.click();
    await repeatEveryInput.fill('');
    await page.keyboard.type('1.5abc');

    const value = await repeatEveryInput.inputValue();
    expect(value).not.toContain('.');
    expect(value).not.toContain('a');
    expect(value).not.toContain('b');
    expect(value).not.toContain('c');
  });
});
