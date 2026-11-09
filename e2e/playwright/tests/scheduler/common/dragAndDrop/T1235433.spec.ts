import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { textMatcher } from '../../../../models/internal/textMatcher';
import Scheduler from '../../../../models/scheduler';
import type Appointment from '../../../../models/scheduler/appointment';
import { scrollTo } from '../../helpers/utils';

const createScheduler = (page: Page, view: string) => createWidget(page, 'dxScheduler', {
  timeZone: 'America/Los_Angeles',
  dataSource: [
    {
      text: 'Book 1',
      startDate: new Date('2021-02-02T18:00:00.000Z'),
      endDate: new Date('2021-02-02T19:00:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 2',
      startDate: new Date('2021-02-03T01:00:00.000Z'),
      endDate: new Date('2021-02-03T02:15:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 3',
      startDate: new Date('2021-02-09T01:00:00.000Z'),
      endDate: new Date('2021-02-09T02:15:00.000Z'),
      priority: 1,
    },
  ],
  views: [view],
  currentView: view,
  currentDate: new Date('2021-02-02T17:00:00.000Z'),
  firstDayOfWeek: 0,
  scrolling: { mode: 'virtual' },
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  groups: ['priority'],
  useDropDownViewSwitcher: false,
  resources: [{
    fieldExpr: 'priority',
    dataSource: [
      { id: 1, text: 'Low Priority', color: 'green' },
      { id: 2, text: 'High Priority', color: 'blue' },
    ],
    label: 'Priority',
  }],
  height: 580,
});

const dragAppointmentByCircle = async (
  page: Page,
  appointment: Appointment,
  label: string[],
  description: string[],
): Promise<void> => {
  await dragToOffset(page, appointment.element, -200, 0);
  await expect(appointment.element).toHaveAttribute('aria-label', textMatcher(label[0]));
  await expect.poll(() => appointment.getAriaDescription()).toContain(description[0]);

  await dragToOffset(page, appointment.element, 0, 200);
  await expect(appointment.element).toHaveAttribute('aria-label', textMatcher(label[1]));
  await expect.poll(() => appointment.getAriaDescription()).toContain(description[1]);

  await dragToOffset(page, appointment.element, 200, 0);
  await expect(appointment.element).toHaveAttribute('aria-label', textMatcher(label[2]));
  await expect.poll(() => appointment.getAriaDescription()).toContain(description[2]);

  await dragToOffset(page, appointment.element, 0, -200);
  await expect(appointment.element).toHaveAttribute('aria-label', textMatcher(label[3]));
  await expect.poll(() => appointment.getAriaDescription()).toContain(description[3]);
};
const appointmentDescriptions = ['Group: Low Priority', 'Group: High Priority', 'Group: High Priority', 'Group: Low Priority'];
const appointment1Times = ['9:00 AM - 10:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '10:00 AM - 11:00 AM'];
const appointment2Times = ['4:00 PM - 5:15 PM', '4:00 PM - 5:15 PM', '5:00 PM - 6:15 PM', '5:00 PM - 6:15 PM'];

test.describe('Scheduler Drag-and-Drop inside Group', () => {
  test.use({ theme: 'generic.light' });

  test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineDay)', async ({ page }) => {
    await createScheduler(page, 'timelineDay');

    const scheduler = new Scheduler(page, '#container');

    await expect(scheduler.element).toBeAttached();

    await dragAppointmentByCircle(page, scheduler.getAppointment('Book 1'), appointment1Times, appointmentDescriptions);
    await scrollTo(page, 1400, 0);
    await dragAppointmentByCircle(page, scheduler.getAppointment('Book 2'), appointment2Times, appointmentDescriptions);
  });

  test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineWorkWeek)', async ({ page }) => {
    await createScheduler(page, 'timelineWorkWeek');

    const scheduler = new Scheduler(page, '#container');

    await expect(scheduler.element).toBeAttached();

    await scrollTo(page, 2400, 0);
    await dragAppointmentByCircle(page, scheduler.getAppointment('Book 1'), appointment1Times, appointmentDescriptions);
    await scrollTo(page, 3400, 0);
    await dragAppointmentByCircle(page, scheduler.getAppointment('Book 2'), appointment2Times, appointmentDescriptions);
  });

  test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineMonth)', async ({ page }) => {
    await createScheduler(page, 'timelineMonth');

    const scheduler = new Scheduler(page, '#container');

    await expect(scheduler.element).toBeAttached();

    await dragAppointmentByCircle(page, scheduler.getAppointment('Book 1'), [
      'February 1, 2021',
      'February 1, 2021',
      'February 2, 2021',
      'February 2, 2021',
    ], appointmentDescriptions);
    await scrollTo(page, 1000, 0);
    await dragAppointmentByCircle(page, scheduler.getAppointment('Book 3'), [
      'February 7, 2021',
      'February 7, 2021',
      'February 8, 2021',
      'February 8, 2021',
    ], appointmentDescriptions);
  });
});
