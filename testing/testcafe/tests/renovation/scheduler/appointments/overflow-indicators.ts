import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import cloneTest from '../../../../helpers/check-all-platforms';

const SCHEDULER_SELECTOR = '.test-scheduler';

const test = (options?: any): any => cloneTest(
  'declaration/scheduler',
  ['react'],
  options,
);

fixture('Renovated scheduler - Overflow indicator')
  .beforeEach((t) => t.resizeWindow(1200, 800));

[
  'week',
  'month',
].forEach((currentView) => {
  [
    { groupOrientation: 'vertical', rtlEnabled: false },
    { groupOrientation: 'horizontal', rtlEnabled: false },
    { groupOrientation: 'vertical', rtlEnabled: true },
    { groupOrientation: 'horizontal', rtlEnabled: true },
  ].forEach(({ groupOrientation, rtlEnabled }) => {
    test({
      dataSource: [
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
        {
          text: 'Appt-1-2-1',
          groupId: [2, 1],
          startDate: new Date(2021, 3, 6, 9, 30),
          endDate: new Date(2021, 3, 6, 11, 30),
        },
        {
          text: 'Appt-1-2',
          groupId: 2,
          startDate: new Date(2021, 3, 6, 9, 30),
          endDate: new Date(2021, 3, 6, 11, 30),
        },
      ],
      maxAppointmentsPerCell: 1,
      rtlEnabled,
      views: [{
        type: currentView,
        groupOrientation,
      }],
      currentView,
      currentDate: new Date(2021, 3, 4),
      startDayHour: 9,
      endDayHour: 14,
      groups: ['groupId'],
      resources: [
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
      ],
      showCurrentTimeIndicator: false,
    })(`it should be rendered correctly if view=${currentView}, groupOrientation=${groupOrientation}, rtl=${rtlEnabled}`,
      async (t, { screenshotComparerOptions }) => {
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);
        const appointmentCount = scheduler.getAppointmentCount();

        await t
          .expect(appointmentCount)
          .eql(4)
          .expect(await compareScreenshot(
            t,
            `scheduler_overflow-indicator_${currentView}-view_${groupOrientation}_rtl-${rtlEnabled}.png`,
            scheduler.element,
            screenshotComparerOptions,
          ))
          .ok();
      });
  });
});
