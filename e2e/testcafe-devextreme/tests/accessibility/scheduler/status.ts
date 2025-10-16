import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Scheduler - Status`
  .page(url(__dirname, '../../container.html'));

const today = '2025-04-30T15:00:00.000Z';
const appointments = [
  {
    startDate: '2025-04-25T21:30:00.000Z',
    endDate: '2025-04-25T23:30:00.000Z',
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=15;COUNT=15',
  }, {
    startDate: '2025-04-30T15:00:00.000Z',
    endDate: '2025-04-30T16:00:00.000Z',
  }, {
    startDate: '2025-04-26T00:30:00.000Z',
    endDate: '2025-04-26T02:30:00.000Z',
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=15;COUNT=15',
  }, {
    startDate: '2025-05-02T15:00:00.000Z',
    endDate: '2025-05-02T16:00:00.000Z',
  },
];

const statusCheck = async (t: TestController, scheduler: Scheduler, status: string) => {
  await t.expect(scheduler.element.getAttribute('aria-label')).contains(status);
  await t.expect(scheduler.getGeneralStatusContainer().textContent).contains(status);
};
const statusCheckEql = async (t: TestController, scheduler: Scheduler, status: string) => {
  await t.expect(scheduler.element.getAttribute('aria-label')).match(new RegExp(status));
  await t.expect(scheduler.getGeneralStatusContainer().textContent).match(new RegExp(status));
};

const options = [
  ['agenda', 'Agenda view: from April 30, 2025 to May 6, 2025', [0, 9, 19]],
  ['day', 'Day view: April 30, 2025', [0, 3, 5]],
  ['month', 'Month view: from March 2025 to May 2025', [0, 17, 35]],
  ['timelineDay', 'Timeline Day view: April 30, 2025', [0, 3, 5]],
  ['timelineMonth', 'Timeline Month view: April 2025', [0, 11, 21]],
  ['timelineWeek', 'Timeline Week view: from April 27, 2025 to May 3, 2025', [0, 12, 25]],
  ['timelineWorkWeek', 'Timeline Work Week view: from April 28, 2025 to May 2, 2025', [0, 9, 18]],
  ['week', 'Week view: from April 27, 2025 to May 3, 2025', [0, 13, 27]],
  ['workWeek', 'Work Week view: from April 28, 2025 to May 2, 2025', [0, 10, 20]],
  ['Two Weeks', 'Two Weeks view: from April 27, 2025 to May 10, 2025', [0, 14, 29]],
] as const;
const indicatorOnView = 'The current time indicator is visible in the view';
const indicatorNotOnView = 'The current time indicator is not visible on the screen';

options.forEach(([currentView, title, counts]) => {
  counts.forEach((appointmentsCount, index) => {
    const schedulerConfig = {
      timeZone: 'America/Los_Angeles',
      dataSource: appointments.slice(0, 2 * index),
      views: [
        'agenda', 'day', 'month', 'timelineDay', 'timelineMonth', 'timelineWeek', 'timelineWorkWeek', 'week', 'workWeek', {
          name: 'Two Weeks',
          type: 'week',
          intervalCount: 2,
        },
      ],
      currentView,
      indicatorTime: today,
      currentDate: today,
    };
    // TODO(2): use `appointmentsCount` here
    const generalStatus = `Scheduler. ${title} with ${index === 0 ? 0 : '\\d*'} appointments`;

    test(`Scheduler should have correct status message [view=${currentView}, count=${appointmentsCount}, indicator=false]`, async (t) => {
      const scheduler = new Scheduler('#container');

      await statusCheckEql(t, scheduler, generalStatus);
    }).before(async () => {
      await createWidget('dxScheduler', { ...schedulerConfig, showCurrentTimeIndicator: false });
    });

    test(`Scheduler should have correct status message [view=${currentView}, count=${appointmentsCount}, indicator=true]`, async (t) => {
      const scheduler = new Scheduler('#container');

      await t.click(scheduler.toolbar.navigator.nextButton);
      await statusCheck(t, scheduler, currentView === 'month' ? indicatorOnView : indicatorNotOnView);

      await t.click(scheduler.toolbar.navigator.prevButton);
      await statusCheckEql(t, scheduler, `${generalStatus}. ${indicatorOnView}`);

      await t.click(scheduler.toolbar.navigator.prevButton);
      await statusCheck(t, scheduler, indicatorNotOnView);
    }).before(async () => {
      await createWidget('dxScheduler', { ...schedulerConfig, showCurrentTimeIndicator: true });
    });
  });
});

[
  ['timelineWeek', 'Scheduler. Timeline Week view: from April 27, 2025 to May 3, 2025 with 5 appointments'],
  ['week', 'Scheduler. Week view: from April 27, 2025 to May 3, 2025 with 5 appointments'],
].forEach(([currentView, title]) => {
  test(`Scheduler should have correct status message if the appointments are partial [view=${currentView}]`, async (t) => {
    const scheduler = new Scheduler('#container');

    await statusCheckEql(t, scheduler, title);
  }).before(async () => {
    await createWidget('dxScheduler', {
      timeZone: 'America/Los_Angeles',
      dataSource: [{
        startDate: '2025-04-29T23:18:00.000Z',
        endDate: '2025-04-30T16:12:00.000Z',
      }, {
        startDate: '2025-04-26T23:18:00.000Z',
        endDate: '2025-04-27T12:12:00.000Z',
        recurrenceRule: 'FREQ=DAILY;INTERVAL=2;COUNT=5',
      }],
      views: ['timelineWeek', 'week'],
      currentView,
      indicatorTime: today,
      currentDate: today,
    });
  });
});
