import { compareScreenshot } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import cloneTest from '../../../../helpers/check-all-platforms';

const SCHEDULER_SELECTOR = '.test-scheduler';

const test = (options?: any): any => cloneTest(
  'declaration/scheduler',
  ['react'],
  options,
);

fixture('Renovated scheduler - Adaptive appointments')
  .beforeEach((t) => t.resizeWindow(1200, 800));

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
    adaptivityEnabled: true,
    rtlEnabled,
    views: [{
      type: 'month',
      groupOrientation,
    }],
    currentView: 'month',
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
  })(`it should be rendered correctly if groupOrientation=${groupOrientation}, rtl=${rtlEnabled}`,
    async (t, { screenshotComparerOptions }) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const { collectors } = scheduler;

      await t
        .expect(collectors.count)
        .eql(4)
        .expect(collectors.get(0).isCompact)
        .ok()
        .expect(collectors.get(1).isCompact)
        .ok()
        .expect(collectors.get(2).isCompact)
        .ok()
        .expect(collectors.get(3).isCompact)
        .ok()
        .expect(await compareScreenshot(
          t,
          `scheduler_adaptive_appointments_${groupOrientation}_rtl-${rtlEnabled}.png`,
          scheduler.element,
          screenshotComparerOptions,
        ))
        .ok();
    });
});
