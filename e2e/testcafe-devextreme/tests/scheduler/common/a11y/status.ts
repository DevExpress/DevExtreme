import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`a11y - appointment`
  .page(url(__dirname, '../../../container.html'));

const today = new Date(Date.UTC(2025, 3, 29, 15));
today.setDate(today.getDate() - today.getDay() + 3);
const appointments = [
  {
    startDate: new Date(today.getTime() - 113.5 * 3600000),
    endDate: new Date(today.getTime() - 111.5 * 3600000),
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=15;COUNT=15',
  }, {
    startDate: new Date(today.getTime()),
    endDate: new Date(today.getTime() + 3600000),
  }, {
    startDate: new Date(today.getTime() - 110.5 * 3600000),
    endDate: new Date(today.getTime() - 108.5 * 3600000),
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=15;COUNT=15',
  }, {
    startDate: new Date(today.getTime() + 48 * 3600000),
    endDate: new Date(today.getTime() + 49 * 3600000),
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
    [true, false].forEach((hasIndicator) => {
      test(`Scheduler should have correct status message [view=${currentView}, count=${appointmentsCount}, indicator=${hasIndicator}]`, async (t) => {
        const scheduler = new Scheduler('#container');
        // TODO(2): use `appointmentsCount` here
        const generalStatus = `Scheduler. ${title} with ${index === 0 ? 0 : '\\d*'} appointments`;

        if (hasIndicator) {
          await t.click(scheduler.toolbar.navigator.nextButton);
          await statusCheck(t, scheduler, currentView === 'month' ? indicatorOnView : indicatorNotOnView);

          await t.click(scheduler.toolbar.navigator.prevButton);
          await statusCheckEql(t, scheduler, `${generalStatus}. ${indicatorOnView}`);

          await t.click(scheduler.toolbar.navigator.prevButton);
          await statusCheck(t, scheduler, indicatorNotOnView);
        } else {
          await statusCheckEql(t, scheduler, generalStatus);
        }
      }).before(async () => {
        await createWidget('dxScheduler', {
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
          showCurrentTimeIndicator: hasIndicator,
        });
      });
    });
  });
});
