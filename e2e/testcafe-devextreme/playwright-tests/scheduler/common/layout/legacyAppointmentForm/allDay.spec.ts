import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, Scheduler } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe.skip('Layout:AppointmentForm:AllDay', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Start and end dates should be reflect the current day(appointment is already available case)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Text',
        startDate: new Date(2021, 3, 28, 10),
        endDate: new Date(2021, 3, 28, 12),
      }],
      editing: { legacyForm: true },
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
    });

    const scheduler = new Scheduler(page);
    const appointment = scheduler.getAppointment('Text');
    await appointment.element.click();

    const tooltipItem = scheduler.appointmentTooltip.getListItem('Text');
    await tooltipItem.element.click();

    await expect(scheduler.appointmentPopup.element).toBeVisible();

    const allDaySwitch = scheduler.appointmentPopup.allDaySwitch;
    await allDaySwitch.click();

    const startDateInput = scheduler.appointmentPopup.startDateEditor.locator('.dx-texteditor-input');
    const endDateInput = scheduler.appointmentPopup.endDateEditor.locator('.dx-texteditor-input');

    const startValue = await startDateInput.inputValue();
    const endValue = await endDateInput.inputValue();

    expect(startValue).toContain('4/28/2021');
    expect(endValue).toContain('4/28/2021');
  });

  test('Start and end dates should be reflect the current day(create new appointment case)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      editing: { legacyForm: true },
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
    });

    const scheduler = new Scheduler(page);
    const cell = scheduler.getDateTableCell(0, 0);
    await cell.dblclick();

    await expect(scheduler.appointmentPopup.element).toBeVisible();

    const allDaySwitch = scheduler.appointmentPopup.allDaySwitch;
    await allDaySwitch.click();

    const startDateInput = scheduler.appointmentPopup.startDateEditor.locator('.dx-texteditor-input');
    const endDateInput = scheduler.appointmentPopup.endDateEditor.locator('.dx-texteditor-input');

    const startValue = await startDateInput.inputValue();
    const endValue = await endDateInput.inputValue();

    expect(startValue).toBeTruthy();
    expect(endValue).toBeTruthy();
  });

  test('StartDate and endDate should have correct type after "allDay" and "repeat" option are changed (T1002864)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 1, 1),
      editing: { legacyForm: true },
    });

    const scheduler = new Scheduler(page);
    const cell = scheduler.getDateTableCell(0, 0);
    await cell.dblclick();

    await expect(scheduler.appointmentPopup.element).toBeVisible();

    const allDaySwitch = scheduler.appointmentPopup.allDaySwitch;
    await allDaySwitch.click();

    const recurrenceSwitch = scheduler.appointmentPopup.recurrenceGroup.locator('.dx-switch').first();
    if (await recurrenceSwitch.isVisible()) {
      await recurrenceSwitch.click();
    }

    await allDaySwitch.click();

    const startDateInput = scheduler.appointmentPopup.startDateEditor.locator('.dx-texteditor-input');
    const startValue = await startDateInput.inputValue();
    expect(startValue).toBeTruthy();
  });
});
