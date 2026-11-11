import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}

const getBoundingClientRect = (element: Locator): Promise<Rect> => element.evaluate((node) => {
  const {
    width, height, top, left,
  } = node.getBoundingClientRect();

  return {
    width, height, top, left,
  };
});

const roughEqualClientBoundingRect = (a: Rect, b: Rect): boolean => (
  Math.abs(a.width - b.width) < 1
  && Math.abs(a.height - b.height) < 1
  && Math.abs(a.top - b.top) < 1
  && Math.abs(a.left - b.left) < 1
);

test.describe('Appointment Form: Functional', () => {
  test('Subject text editor should have focus after returning from recurrence form', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, true);

    await appointmentPopup.clickRecurrenceSettingsButton();

    await appointmentPopup.recurrence.backButton.click();

    await expect(appointmentPopup.textEditor.input).toBeFocused();
  });

  test('Recurrence start date editor should have focus after opening recurrence settings', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
    });

    const appointment = {
      text: 'Appointment',
      startDate: new Date('2021-04-26T16:30:00.000Z'),
      endDate: new Date('2021-04-26T18:30:00.000Z'),
      allDay: false,
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    };

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const appointmentPopup = await scheduler.openAppointmentPopup(appointment, true);

    await appointmentPopup.clickRecurrenceSettingsButton();

    await expect(appointmentPopup.recurrence.startDateInput).toBeFocused();
  });

  test('Popup should not change dimensions when switching groups and recurrence group height is larger', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      editing: {
        form: {
          items: [
            {
              name: 'mainGroup',
              items: ['repeatGroup'],
            },
            'recurrenceGroup',
          ],
        },
      },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const { contentElement } = scheduler.appointmentPopup;

    await scheduler.openAppointmentPopup();
    const boundingClientRect1 = await getBoundingClientRect(contentElement);

    await scheduler.appointmentPopup.selectRepeatValue('Weekly');
    const boundingClientRect2 = await getBoundingClientRect(contentElement);

    await scheduler.appointmentPopup.recurrence.backButton.click();
    const boundingClientRect3 = await getBoundingClientRect(contentElement);

    expect(roughEqualClientBoundingRect(boundingClientRect1, boundingClientRect2)).toBe(true);
    expect(roughEqualClientBoundingRect(boundingClientRect1, boundingClientRect3)).toBe(true);
  });

  test('Popup should not change dimensions when switching groups and main group height is larger', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25),
      editing: {
        form: {
          items: [
            'mainGroup',
            {
              name: 'recurrenceGroup',
              items: ['recurrenceStartDateGroup'],
            },
          ],
        },
      },
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
    const { contentElement } = scheduler.appointmentPopup;

    await scheduler.openAppointmentPopup();
    const boundingClientRect1 = await getBoundingClientRect(contentElement);

    await scheduler.appointmentPopup.selectRepeatValue('Weekly');
    const boundingClientRect2 = await getBoundingClientRect(contentElement);

    await scheduler.appointmentPopup.recurrence.backButton.click();
    const boundingClientRect3 = await getBoundingClientRect(contentElement);

    expect(roughEqualClientBoundingRect(boundingClientRect1, boundingClientRect2)).toBe(true);
    expect(roughEqualClientBoundingRect(boundingClientRect1, boundingClientRect3)).toBe(true);
  });
});
