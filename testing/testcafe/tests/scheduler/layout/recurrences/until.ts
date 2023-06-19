import { compareScreenshot } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`until property in recurrence rule`
  .page(url(__dirname, '../../container.html'));

[
  {
    timeZone: 'America/Los_Angeles',
    startDayHour: 22,
    endDayHour: 24,
    caseText: 'timezone-in-grid',
  }, {
    startDayHour: 9,
    endDayHour: 11,
    caseText: 'without-timezone',
  }, {
    startDayHour: 9,
    endDayHour: 11,
    startDateTimeZone: 'America/Los_Angeles',
    endDateTimeZone: 'America/Los_Angeles',
    caseText: 'timezone-in-appointment',
  },
].forEach(({
  timeZone, startDayHour, endDayHour, endDateTimeZone, startDateTimeZone, caseText,
}) => {
  test(`Appointments should be render valid considering UNTIL property in recurrence rule, case(${caseText})`, async (t) => {
    const scheduler = new Scheduler('#container');

    await t.expect(await compareScreenshot(t, `recurrent-appointments-case-${caseText}.png`, scheduler.workSpace)).ok();
  }).before(async () => createWidget('dxScheduler', {
    timeZone,
    dataSource: [{
      startDate: '2023-05-24T06:00:00.000Z',
      endDate: '2023-05-24T06:30:00.000Z',
      recurrenceRule: 'FREQ=DAILY;UNTIL=20230526T065959Z',
      text: 'Test',
      endDateTimeZone,
      startDateTimeZone,
    }],
    views: ['week', 'month'],
    currentView: 'week',
    currentDate: new Date('2023-05-23'),
    showAllDayPanel: false,
    startDayHour,
    endDayHour,
  }));
});
