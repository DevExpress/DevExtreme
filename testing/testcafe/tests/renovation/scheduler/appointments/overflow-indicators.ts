import { compareScreenshot } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: ['jquery', 'react'],
});

fixture.disablePageReloads.skip('Renovated scheduler - Overflow indicator');

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
    test(
      `it should be rendered correctly if view=${currentView}, groupOrientation=${groupOrientation}, rtl=${rtlEnabled}`,
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
      },
    ).before(
      async (t, { platform }) => {
        await t.resizeWindow(1200, 800);
        await createWidget(platform, 'dxScheduler', {
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
        });
      },
    ).after(async (t) => restoreBrowserSize(t));
  });
});

test('Appointment collector has correct offset when adaptivityEnabled=true', async (t, { screenshotComparerOptions }) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .expect(await compareScreenshot(
      t,
      'appointment-collector-adaptability-timelineMonth.png',
      scheduler.workSpace,
      screenshotComparerOptions,
    ))
    .ok();
}).before(async (_, { platform }) => createWidget(platform, 'dxScheduler', {
  adaptivityEnabled: true,
  currentDate: new Date(2021, 7, 1),
  views: ['timelineMonth'],
  currentView: 'timelineMonth',
  dataSource: [{
    text: 'text',
    startDate: new Date(2021, 7, 1),
    endDate: new Date(2021, 7, 2),
  }],
  height: 300,
})).after(async (t) => restoreBrowserSize(t));
