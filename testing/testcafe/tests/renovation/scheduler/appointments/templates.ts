import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: [/* 'jquery' , */'react'],
});

const data = [
  {
    text: 'Appt-0',
    groupId: [1, 2],
    startDate: new Date(2021, 3, 5),
    allDay: true,
  },
  // TODO uncomment after fix bug with overflow indicator in all day panel
  // {
  //   text: 'Appt-1',
  //   groupId: [1, 2],
  //   startDate: new Date(2021, 3, 5),
  //   allDay: true,
  // },
  {
    text: 'Appt-0-1-2',
    groupId: [1, 2],
    startDate: new Date(2021, 3, 5, 9, 30),
    endDate: new Date(2021, 3, 5, 11, 30),
  },
  {
    text: 'Appt-0-1',
    groupId: 1,
    startDate: new Date(2021, 3, 5, 9, 30),
    endDate: new Date(2021, 3, 5, 11, 30),
  },
];

const resources = [
  {
    fieldExpr: 'groupId',
    dataSource: [{
      text: 'Group-0',
      id: 1,
      color: '#1e90ff',
    }, {
      text: 'Group-1',
      id: 2,
      color: '#ff9747',
    }],
    label: 'Priority',
  },
];

fixture.disablePageReloads.skip('Renovated scheduler - Appointment templates');

[
  'week',
  'month',
].forEach((currentView) => {
  test(
    `it should be rendered correctly if view=${currentView}`,
    async (t, { screenshotComparerOptions }) => {
      const { element } = new Scheduler(SCHEDULER_SELECTOR);

      await t
        .expect(await compareScreenshot(
          t,
          `scheduler_appointment_template_${currentView}.png`,
          element,
          screenshotComparerOptions,
        ))
        .ok();
    },
  ).before(
    async (t, { platform }) => {
      await t.resizeWindow(1200, 800);
      await createWidget(platform, 'dxScheduler', {
        dataSource: data,
        maxAppointmentsPerCell: 1,
        views: [{
          type: currentView,
        }],
        currentView,
        currentDate: new Date(2021, 3, 4),
        startDayHour: 9,
        endDayHour: 14,
        groups: ['groupId'],
        resources,
        showCurrentTimeIndicator: false,
        appointmentTemplate: () => 'Test-Appt',
        appointmentCollectorTemplate: () => 'Test',
      });
    },
  ).after(async (t) => restoreBrowserSize(t));
});
