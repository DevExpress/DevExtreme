import { restoreBrowserSize } from '../../../../helpers/restoreBrowserSize';
import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  platforms: [/* 'jquery', */'react'], // TODO unskip after fix children in tooltip
});

fixture('Renovated scheduler - Reduced icon tooltip');

['timelineDay', 'week'].forEach((currentView) => {
  test(`it should show reduced icon tooltip in '${currentView}' view`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const appointment0 = scheduler.getAppointment('appt-0');
    const appointment1 = scheduler.getAppointment('appt-1');

    const { reducedIconTooltip } = scheduler;

    await t
      .hover(appointment0.reducedIcon)
      .expect(reducedIconTooltip.exists)
      .ok()
      .expect(reducedIconTooltip.text)
      .eql('End Date: July 19, 2020');

    await t
      .hover(appointment0.element)
      .expect(reducedIconTooltip.exists)
      .notOk();

    await t
      .hover(appointment1.reducedIcon)
      .expect(reducedIconTooltip.exists)
      .ok()
      .expect(reducedIconTooltip.text)
      .eql('End Date: July 25, 2020');

    await t
      .hover(appointment1.element)
      .expect(reducedIconTooltip.exists)
      .notOk();
  }).before(async (t, { platform }) => {
    await t.resizeWindow(1200, 800);
    await createWidget(platform, 'dxScheduler', {
      dataSource: [{
        text: 'appt-0',
        startDate: new Date(2020, 6, 15, 17),
        endDate: new Date(2020, 6, 19, 18),
      }, {
        text: 'appt-1',
        startDate: new Date(2020, 6, 15, 17, 30),
        endDate: new Date(2020, 6, 25, 18),
      }],
      currentDate: new Date(2020, 6, 15),
      height: 600,
      width: 600,
      startDayHour: 16.5,
      endDayHour: 18,
      views: ['timelineDay', 'week'],
      currentView,
    });
  }).after(async (t) => restoreBrowserSize(t));
});
