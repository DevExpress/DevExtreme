import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { getFullThemeName } from '../../../../helpers/themeUtils';
import type Appointment from '../../../../models/scheduler/appointment';
import Scheduler from '../../../../models/scheduler';

const createScheduler = (page: Page, view: string): Promise<void> => createWidget(page, 'dxScheduler', {
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

const DIRECTIONS: [number, number][] = [
  [-200, 0],
  [0, 200],
  [200, 0],
  [0, -200],
];

const dragAppointmentByCircle = async (
  page: Page,
  appointment: Appointment,
  label: string[],
  description: string[],
): Promise<void> => {
  for (let step = 0; step < DIRECTIONS.length; step += 1) {
    const [x, y] = DIRECTIONS[step];

    await dragToOffset(page, appointment.element, x, y);

    await expect.poll(async () => appointment.getAriaLabel()).toContain(label[step]);
    await expect.poll(async () => appointment.getAriaDescription()).toContain(description[step]);
  }
};

const appointmentDescriptions = ['Group: Low Priority', 'Group: High Priority', 'Group: High Priority', 'Group: Low Priority'];
const appointment1Times = ['9:00 AM - 10:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '10:00 AM - 11:00 AM'];
const appointment2Times = ['4:00 PM - 5:15 PM', '4:00 PM - 5:15 PM', '5:00 PM - 6:15 PM', '5:00 PM - 6:15 PM'];

// The TestCafe tests named a theme to run in, and the runner dropped them everywhere else: the
// drag distances below are the ones the generic theme's cell sizes produce.
const skipOutsideGeneric = (): void => {
  test.skip(getFullThemeName() !== 'generic.light', 'the drag distances are the generic theme ones');
};

test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineDay)', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  skipOutsideGeneric();

  await createScheduler(page, 'timelineDay');

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.element).toBeVisible();

  await dragAppointmentByCircle(page, scheduler.getAppointment('Book 1'), appointment1Times, appointmentDescriptions);
  await scheduler.scrollWorkSpaceTo({ left: 1400, top: 0 });
  await dragAppointmentByCircle(page, scheduler.getAppointment('Book 2'), appointment2Times, appointmentDescriptions);
});

test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineWorkWeek)', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  skipOutsideGeneric();

  await createScheduler(page, 'timelineWorkWeek');

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.element).toBeVisible();

  await scheduler.scrollWorkSpaceTo({ left: 2400, top: 0 });
  await dragAppointmentByCircle(page, scheduler.getAppointment('Book 1'), appointment1Times, appointmentDescriptions);
  await scheduler.scrollWorkSpaceTo({ left: 3400, top: 0 });
  await dragAppointmentByCircle(page, scheduler.getAppointment('Book 2'), appointment2Times, appointmentDescriptions);
});

test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineMonth)', {
  tag: ['@generic.light'],
}, async ({ page }) => {
  skipOutsideGeneric();

  await createScheduler(page, 'timelineMonth');

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.element).toBeVisible();

  await dragAppointmentByCircle(page, scheduler.getAppointment('Book 1'), [
    'February 1, 2021',
    'February 1, 2021',
    'February 2, 2021',
    'February 2, 2021',
  ], appointmentDescriptions);
  await scheduler.scrollWorkSpaceTo({ left: 1000, top: 0 });
  await dragAppointmentByCircle(page, scheduler.getAppointment('Book 3'), [
    'February 7, 2021',
    'February 7, 2021',
    'February 8, 2021',
    'February 8, 2021',
  ], appointmentDescriptions);
});
