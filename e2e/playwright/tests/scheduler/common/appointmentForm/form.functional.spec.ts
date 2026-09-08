import type { Locator } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

interface Rect { x: number; y: number; width: number; height: number }

const boxOf = async (target: Locator): Promise<Rect> => {
  const box = await target.boundingBox();

  if (!box) {
    throw new Error('The element has no bounding box.');
  }

  return box;
};

const roughEqualClientBoundingRect = (a: Rect, b: Rect): boolean => (
  Math.abs(a.width - b.width) < 1
  && Math.abs(a.height - b.height) < 1
  && Math.abs(a.y - b.y) < 1
  && Math.abs(a.x - b.x) < 1
);

const recurringAppointment = {
  text: 'Appointment',
  startDate: new Date('2021-04-26T16:30:00.000Z'),
  endDate: new Date('2021-04-26T18:30:00.000Z'),
  allDay: false,
  recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
};

test('Subject text editor should have focus after returning from recurrence form', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(recurringAppointment, true);

  await appointmentPopup.clickRecurrenceSettingsButton();

  await appointmentPopup.recurrence.backButton.click();

  await expect(appointmentPopup.textEditor.getInput()).toBeFocused();
});

test('Recurrence start date editor should have focus after opening recurrence settings', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 25),
  });

  const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);
  const appointmentPopup = await scheduler.openAppointmentPopup(recurringAppointment, true);

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

  await scheduler.openAppointmentPopup();
  const boundingClientRect1 = await boxOf(scheduler.appointmentPopup.contentElement);

  await scheduler.appointmentPopup.selectRepeatValue('Weekly');
  const boundingClientRect2 = await boxOf(scheduler.appointmentPopup.contentElement);

  await scheduler.appointmentPopup.recurrence.backButton.click();
  const boundingClientRect3 = await boxOf(scheduler.appointmentPopup.contentElement);

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

  await scheduler.openAppointmentPopup();
  const boundingClientRect1 = await boxOf(scheduler.appointmentPopup.contentElement);

  await scheduler.appointmentPopup.selectRepeatValue('Weekly');
  const boundingClientRect2 = await boxOf(scheduler.appointmentPopup.contentElement);

  await scheduler.appointmentPopup.recurrence.backButton.click();
  const boundingClientRect3 = await boxOf(scheduler.appointmentPopup.contentElement);

  expect(roughEqualClientBoundingRect(boundingClientRect1, boundingClientRect2)).toBe(true);
  expect(roughEqualClientBoundingRect(boundingClientRect1, boundingClientRect3)).toBe(true);
});
