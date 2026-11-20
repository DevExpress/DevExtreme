import { expect, test } from '../../../helpers/accessibility/test';
import Scheduler from '../../../models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { a11yCheckConfig } from './axe_options';

const appointmentItem = {
  text: 'App 1',
  startDate: Date.UTC(2021, 1, 1, 12),
  endDate: Date.UTC(2021, 1, 1, 13),
};
const currentDate = Date.UTC(2021, 1, 1);

['month', 'week', 'day', 'agenda'].forEach((currentView) => {
  test(`appointment should have correct aria-label and have description (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [appointmentItem],
      currentView,
      currentDate,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('App 1');

    await expect(appointment.element).toHaveAttribute('aria-label', 'App 1: February 1, 2021, 12:00 PM - 1:00 PM');
    await expect(appointment.element).toHaveAttribute('aria-describedby', /.+/);

    await a11yCheck(page, a11yCheckConfig, '#container');
  });

  test(`appointment with template should have correct aria-label and have description (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', (options) => ({
      ...options,
      appointmentTemplate: ({ appointmentData }) => `<div>${appointmentData.text}</div>`,
    }), DEFAULT_SELECTOR, {
      arg: {
        timeZone: 'UTC',
        dataSource: [appointmentItem],
        currentView,
        currentDate,
      },
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('App 1');

    await expect(appointment.element).toHaveAttribute('aria-label', 'App 1: February 1, 2021, 12:00 PM - 1:00 PM');
    await expect(appointment.element).toHaveAttribute('aria-describedby', /.+/);

    await a11yCheck(page, a11yCheckConfig, '#container');
  });

  test(`appointment should have correct aria-label with one group (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        ...appointmentItem,
        groupId: 1,
      }],
      currentView,
      currentDate,
      groups: ['groupId'],
      resources: [
        {
          fieldExpr: 'groupId',
          dataSource: [{
            text: 'resource1',
            id: 1,
          }],
          label: 'Group 1',
        },
      ],
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('App 1');

    await expect(appointment.element).toHaveAttribute('aria-label', 'App 1: February 1, 2021, 12:00 PM - 1:00 PM');
    expect(await appointment.getAriaDescription()).toContain('Group: resource1; Group 1: resource1');

    await a11yCheck(page, a11yCheckConfig, '#container');
  });

  test(`appointment with template should have correct aria-label and description (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', (options) => ({
      ...options,
      appointmentTemplate: ({ appointmentData }) => `<div>${appointmentData.text}</div>`,
    }), DEFAULT_SELECTOR, {
      arg: {
        timeZone: 'UTC',
        dataSource: [{
          ...appointmentItem,
          groupId: 1,
        }],
        currentView,
        currentDate,
        groups: ['groupId'],
        resources: [
          {
            fieldExpr: 'groupId',
            dataSource: [{
              text: 'resource1',
              id: 1,
            }],
            label: 'Group 1',
          },
        ],
      },
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('App 1');

    await expect(appointment.element).toHaveAttribute('aria-label', 'App 1: February 1, 2021, 12:00 PM - 1:00 PM');
    expect(await appointment.getAriaDescription()).toContain('Group: resource1; Group 1: resource1');

    await a11yCheck(page, a11yCheckConfig, '#container');
  });

  test(`appointment should have correct aria-label with multiple group (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        ...appointmentItem,
        groupId1: 1,
        groupId2: [1, 2],
      }],
      currentView,
      currentDate,
      groups: ['groupId1', 'groupId2'],
      resources: [
        {
          fieldExpr: 'groupId1',
          dataSource: [{
            text: 'resource11',
            id: 1,
          }],
          label: 'Group 1',
        },
        {
          fieldExpr: 'groupId2',
          dataSource: [{
            text: 'resource21',
            id: 1,
          }, {
            text: 'resource22',
            id: 2,
          }],
          label: 'Group 2',
        },
      ],
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('App 1');

    await expect(appointment.element).toHaveAttribute('aria-label', 'App 1: February 1, 2021, 12:00 PM - 1:00 PM');
    expect(await appointment.getAriaDescription()).toContain('Group: resource11, resource21; Group 1: resource11; Group 2: resource21, resource22');

    await a11yCheck(page, a11yCheckConfig, '#container');
  });

  test(`appointments should have accessible info about reccurence (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
          recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
        },
      ],
      currentView,
      currentDate: new Date('2021-04-29T18:30:00.000Z'),
      startDayHour: 9,
    });

    const scheduler = new Scheduler(page, '#container');
    const recurrenceIcon = scheduler.getAppointment('Website Re-Design Plan').getRecurrenceElement();

    await expect(recurrenceIcon).toHaveAttribute('aria-label', 'Recurring appointment');

    await a11yCheck(page, a11yCheckConfig, '#container');
  });

  test(`appointments should have right role (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        },
      ],
      currentView,
      currentDate: new Date('2021-04-29T18:30:00.000Z'),
      startDayHour: 9,
    });

    const scheduler = new Scheduler(page, '#container');
    const appt = scheduler.getAppointment('Website Re-Design Plan');

    await expect(appt.element).toHaveAttribute('role', 'button');
    await expect(appt.element).not.toHaveAttribute('aria-activedescendant');

    await a11yCheck(page, a11yCheckConfig, '#container');
  });
});

[
  {
    currentView: 'week',
    startDate: Date.UTC(2021, 1, 1, 12),
    endDate: Date.UTC(2021, 1, 3, 13),
    labels: [
      'App 1: February 1, 2021, 12:00 PM - February 3, 2021, 1:00 PM (1/3)',
      'App 1: February 1, 2021, 12:00 PM - February 3, 2021, 1:00 PM (2/3)',
      'App 1: February 1, 2021, 12:00 PM - February 3, 2021, 1:00 PM (3/3)',
    ],
  },
  {
    currentView: 'month',
    startDate: Date.UTC(2021, 1, 1, 12),
    endDate: Date.UTC(2021, 1, 17, 13),
    labels: [
      'App 1: February 1, 2021, 12:00 PM - February 17, 2021, 1:00 PM (1/3)',
      'App 1: February 1, 2021, 12:00 PM - February 17, 2021, 1:00 PM (2/3)',
      'App 1: February 1, 2021, 12:00 PM - February 17, 2021, 1:00 PM (3/3)',
    ],
  },
].forEach(({
  currentView, startDate, endDate, labels,
}) => {
  test(`appointment should have correct aria-label if it is multipart (${currentView})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      timeZone: 'UTC',
      dataSource: [{
        text: 'App 1',
        startDate,
        endDate,
      }],
      allDayPanelMode: 'hidden',
      currentView,
      currentDate: Date.UTC(2021, 1, 1),
    });

    const scheduler = new Scheduler(page, '#container');

    for (let i = 0; i < labels.length; i += 1) {
      await expect(scheduler.getAppointment('App 1', i).element).toHaveAttribute('aria-label', labels[i]);
    }

    await a11yCheck(page, a11yCheckConfig, '#container');
  });
});

test('appointments & collector buttons can be navigated', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        text: 'App 1',
        startDate: new Date(2021, 1, 1),
        endDate: new Date(2021, 1, 1),
      },
      {
        text: 'App 2',
        startDate: new Date(2021, 1, 2),
        endDate: new Date(2021, 1, 2),
      },
      {
        text: 'App 3',
        startDate: new Date(2021, 1, 2),
        endDate: new Date(2021, 1, 2),
      },
      {
        text: 'App 4',
        startDate: new Date(2021, 1, 3),
        endDate: new Date(2021, 1, 3),
      },
    ],
    allDayPanelMode: 'hidden',
    currentView: 'month',
    maxAppointmentsPerCell: 1,
    currentDate: new Date(2021, 1, 1),
  });

  const scheduler = new Scheduler(page, '#container');

  // forward
  await scheduler.workSpace.click();
  await page.keyboard.press('Tab');
  await expect(scheduler.getAppointment('App 1').element).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(scheduler.getAppointment('App 2').element).toBeFocused();

  await page.keyboard.press('Tab');
  await scheduler.collectors.get(0).expectFocused();

  await page.keyboard.press('Tab');
  await expect(scheduler.getAppointment('App 4').element).toBeFocused();

  // backward

  await page.keyboard.press('Shift+Tab');
  await scheduler.collectors.get(0).expectFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(scheduler.getAppointment('App 2').element).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(scheduler.getAppointment('App 1').element).toBeFocused();

  // open list
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await scheduler.collectors.get(0).expectFocused();

  await page.keyboard.press('Enter');
  await expect(scheduler.appointmentTooltip.element).toHaveCount(1);

  await a11yCheck(page, a11yCheckConfig, '#container');
});

test('Scheduler a11y: Disabled time ranges are not supported', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
      },
    ],
    currentView: 'day',
    currentDate: new Date(2021, 3, 27),
  });

  const scheduler = new Scheduler(page, '#container');
  const {
    nextButton,
    prevButton,
  } = scheduler.toolbar.navigator;
  const expectedAriaLabels = {
    prev: 'Previous page',
    next: 'Next page',
  };

  await expect(prevButton).toHaveAttribute('aria-label', expectedAriaLabels.prev);
  await expect(nextButton).toHaveAttribute('aria-label', expectedAriaLabels.next);

  await a11yCheck(page, a11yCheckConfig, '#container');
});

test('Scheduler a11y: appointments does not have info about reccurence', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [
      {
        text: 'Website Re-Design Plan',
        startDate: new Date('2021-04-26T16:30:00.000Z'),
        endDate: new Date('2021-04-26T18:30:00.000Z'),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
      },
    ],
    views: ['day', 'week', 'workWeek', 'month'],
    currentView: 'day',
    currentDate: new Date(2021, 3, 29),
    startDayHour: 9,
  });

  const scheduler = new Scheduler(page, '#container');
  const recurrenceIcon = scheduler.getAppointment('Website Re-Design Plan').getRecurrenceElement();

  await expect(recurrenceIcon).toHaveAttribute('aria-label', 'Recurring appointment');

  await a11yCheck(page, a11yCheckConfig, '#container');
});

test('Scheduler a11y: Appointment collector button doesn\'t have info about date', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [
      {
        text: 'Website Re-Design Plan',
        startDate: new Date('2021-03-05T23:45:00.000Z'),
        endDate: new Date('2021-03-05T18:15:00.000Z'),
      },
      {
        text: 'Complete Shipper Selection Form',
        startDate: new Date('2021-03-05T15:30:00.000Z'),
        endDate: new Date('2021-03-05T17:00:00.000Z'),
      },
      {
        text: 'Upgrade Server Hardware',
        startDate: new Date('2021-03-05T19:00:00.000Z'),
        endDate: new Date('2021-03-05T21:15:00.000Z'),
      },
      {
        text: 'Upgrade Personal Computers',
        startDate: new Date('2021-03-05T21:45:00.000Z'),
        endDate: new Date('2021-03-05T23:30:00.000Z'),
      },
    ],
    currentView: 'month',
    currentDate: new Date(2021, 2, 1),
  });

  const scheduler = new Scheduler(page, '#container');
  const schedulerCollector = scheduler.collectors.get(0);
  const dateText = 'March 5, 2021';

  await expect(scheduler.element).toBeAttached();
  await expect(schedulerCollector.element).toHaveAttribute('aria-roledescription', new RegExp(dateText));

  await a11yCheck(page, a11yCheckConfig, '#container');
});

test('appointment aria label should contain date with right timezone', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Install New Router in Dev Room',
      startDate: new Date('2021-03-29T21:30:00.000Z'),
      endDate: new Date('2021-03-29T22:30:00.000Z'),
    }],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointmentByIndex(0);

  await expect(appointment.element).toHaveAttribute('aria-label', 'Install New Router in Dev Room: March 29, 2021, 2:30 PM - 3:30 PM');

  await a11yCheck(page, a11yCheckConfig, '#container');
});
