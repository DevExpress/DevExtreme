import Scheduler from 'devextreme-testcafe-models/scheduler';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { checkOptions } from './axe_options';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../container.html'));

['month', 'week', 'day'].forEach((currentView) => {
  test(`appointment should have correct aria-label without grouping (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    await t
      .expect(
        scheduler.getAppointment('App 1').element.attributes['aria-label'],
      )
      .eql(undefined);

    await a11yCheck(t, checkOptions, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
      }],
      currentView,
      currentDate: new Date(2021, 1, 1),
    });
  });

  test(`appointment should have correct aria-label with one group (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    const attrs = await scheduler.getAppointment('App 1').element.attributes;

    await t
      .expect(attrs['aria-roledescription'])
      .eql('February 1, 2021, Group: resource1, ');

    await a11yCheck(t, checkOptions, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        groupId: 1,
      }],
      currentView,
      currentDate: new Date(2021, 1, 1),
      groups: ['groupId'],
      resources: [
        {
          fieldExpr: 'groupId',
          dataSource: [{
            text: 'resource1',
            id: 1,
          }],
        },
      ],
    });
  });

  test(`appointment should have correct aria-label with multiple group (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    const attrs = await scheduler.getAppointment('App 1').element.attributes;

    await t
      .expect(attrs['aria-roledescription'])
      .eql('February 1, 2021, Group: resource11, resource21, ');

    await a11yCheck(t, checkOptions, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        groupId1: 1,
        groupId2: 1,
      }],
      currentView,
      currentDate: new Date(2021, 1, 1),
      groups: ['groupId1', 'groupId2'],
      resources: [
        {
          fieldExpr: 'groupId1',
          dataSource: [{
            text: 'resource11',
            id: 1,
          }],
        },
        {
          fieldExpr: 'groupId2',
          dataSource: [{
            text: 'resource21',
            id: 1,
          }],
        },
      ],
    });
  });

  test('appointments should have accessible info about reccurence', async (t) => {
    const scheduler = new Scheduler('#container');
    const recurrenceIcon = scheduler.getAppointment('Website Re-Design Plan').getRecurrenceElement();

    await t
      .expect(recurrenceIcon.getAttribute('aria-label'))
      .eql('Recurring appointment');

    await a11yCheck(t, checkOptions, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
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
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
    });
  });

  test('appointments should have right role', async (t) => {
    const scheduler = new Scheduler('#container');
    const appt = scheduler.getAppointment('Website Re-Design Plan');
    const contentId = await appt.element.find('.dx-scheduler-appointment-content').getAttribute('id');

    await t
      .expect(appt.element.getAttribute('role'))
      .eql('application');

    await t
      .expect(appt.element.getAttribute('aria-describedby'))
      .eql(contentId);

    await t
      .expect(appt.element.getAttribute('aria-activedescendant'))
      .eql(null);

    await a11yCheck(t, checkOptions, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [
        {
          text: 'Website Re-Design Plan',
          startDate: new Date('2021-04-29T16:30:00.000Z'),
          endDate: new Date('2021-04-29T18:30:00.000Z'),
        },
      ],
      currentView,
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
    });
  });
});

[
  {
    currentView: 'week',
    startDate: new Date(2021, 1, 1, 12),
    endDate: new Date(2021, 1, 3, 13),
    labels: [
      'February 1, 2021 - February 3, 2021 (1/3), ',
      'February 1, 2021 - February 3, 2021 (2/3), ',
      'February 1, 2021 - February 3, 2021 (3/3), ',
    ],
  },
  {
    currentView: 'month',
    startDate: new Date(2021, 1, 1, 12),
    endDate: new Date(2021, 1, 17, 13),
    labels: [
      'February 1, 2021 - February 17, 2021 (1/3), ',
      'February 1, 2021 - February 17, 2021 (2/3), ',
      'February 1, 2021 - February 17, 2021 (3/3), ',
    ],
  },
].forEach(({
  currentView, startDate, endDate, labels,
}) => {
  test(`appointment should have correct aria-label if it is multipart (${currentView})`, async (t) => {
    const scheduler = new Scheduler('#container');

    const apptLabels = await Promise.all([0, 1, 2].map(
      async (i) => {
        const appt = scheduler.getAppointment('App 1', i);
        const attrs = await appt.element.attributes;
        return attrs['aria-roledescription'];
      },
    ));

    await t.expect(apptLabels[0]).eql(labels[0]);
    await t.expect(apptLabels[1]).eql(labels[1]);
    await t.expect(apptLabels[2]).eql(labels[2]);

    await a11yCheck(t, checkOptions, '#container');
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: [{
        text: 'App 1',
        startDate,
        endDate,
      }],
      allDayPanelMode: 'hidden',
      currentView,
      currentDate: new Date(2021, 1, 1),
    });
  });
});

test('appointments & collector buttons can be navigated', async (t) => {
  const scheduler = new Scheduler('#container');

  // forward
  await t.click(scheduler.workSpace);
  await t.pressKey('tab');
  await t.expect(
    scheduler.getAppointment('App 1').element.focused,
  ).ok();

  await t.pressKey('tab');
  await t.expect(
    scheduler.collectors.get(0).isFocused,
  ).ok();

  await t.pressKey('tab');
  await t.expect(
    scheduler.getAppointment('App 2').element.focused,
  ).ok();

  await t.pressKey('tab');
  await t.expect(
    scheduler.getAppointment('App 4').element.focused,
  ).ok();

  // backward

  await t.pressKey('shift+tab');
  await t.expect(
    scheduler.getAppointment('App 2').element.focused,
  ).ok();

  await t.pressKey('shift+tab');
  await t.expect(
    scheduler.collectors.get(0).isFocused,
  ).ok();

  await t.pressKey('shift+tab');
  await t.expect(
    scheduler.getAppointment('App 1').element.focused,
  ).ok();

  // open list
  await t.pressKey('tab');
  await t.expect(
    scheduler.collectors.get(0).isFocused,
  ).ok();

  await t.pressKey('enter');
  await t.expect(
    scheduler.appointmentTooltip.element.count,
  ).eql(1);

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
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
});

test('Scheduler a11y: Disabled time ranges are not supported', async (t) => {
  const scheduler = new Scheduler('#container');
  const {
    nextButton,
    prevButton,
  } = scheduler.toolbar.navigator;
  const expectedAriaLabels = {
    prev: 'Previous page',
    next: 'Next page',
  };
  const actualPrevAriaLabel = await prevButton.getAttribute('aria-label');
  const actualNextAriaLabel = await nextButton.getAttribute('aria-label');

  await t
    .expect(actualPrevAriaLabel)
    .eql(expectedAriaLabels.prev)
    .expect(actualNextAriaLabel)
    .eql(expectedAriaLabels.next);

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
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
});

test('Scheduler a11y: appointments does not have info about reccurence', async (t) => {
  const scheduler = new Scheduler('#container');
  const recurrenceIcon = scheduler.getAppointment('Website Re-Design Plan').getRecurrenceElement();

  await t
    .expect(recurrenceIcon.getAttribute('aria-label'))
    .eql('Recurring appointment');

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
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
});

test('Scheduler a11y: Appointment collector button doesn\'t have info about date', async (t) => {
  const scheduler = new Scheduler('#container');
  const schedulerCollector = scheduler.collectors.get(0);
  const dateText = 'March 6, 2021';

  await t
    .expect(scheduler.element().exists)
    .ok()
    .expect(schedulerCollector.element().getAttribute('aria-roledescription'))
    .contains(dateText);

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
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
});

test('appointment aria label should contain date with right timezone', async (t) => {
  const scheduler = new Scheduler('#container');
  const appt = scheduler.getAppointmentByIndex(0);

  await t
    .expect(appt.element.getAttribute('aria-roledescription'))
    .eql('March 29, 2021, ');

  await a11yCheck(t, checkOptions, '#container');
}).before(async () => {
  await createWidget('dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Install New Router in Dev Room',
      startDate: new Date('2021-03-29T21:30:00.000Z'),
      endDate: new Date('2021-03-29T22:30:00.000Z'),
    }],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
  });
});
