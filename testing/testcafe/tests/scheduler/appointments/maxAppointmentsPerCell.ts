import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';

fixture`Scheduler: max appointments per cell`
  .page(url(__dirname, '../../container.html'));

const data = [{
  text: 'test_1',
  startDate: new Date('2021-03-28T19:00:00.000Z'),
  endDate: new Date('2021-03-28T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_2_1',
  startDate: new Date('2021-03-29T19:00:00.000Z'),
  endDate: new Date('2021-03-29T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_2_2',
  startDate: new Date('2021-03-29T19:00:00.000Z'),
  endDate: new Date('2021-03-29T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_3_1',
  startDate: new Date('2021-03-30T19:00:00.000Z'),
  endDate: new Date('2021-03-30T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_3_2',
  startDate: new Date('2021-03-30T19:00:00.000Z'),
  endDate: new Date('2021-03-30T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_3_3',
  startDate: new Date('2021-03-30T19:00:00.000Z'),
  endDate: new Date('2021-03-30T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_4_1',
  startDate: new Date('2021-03-31T19:00:00.000Z'),
  endDate: new Date('2021-03-31T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_4_2',
  startDate: new Date('2021-03-31T19:00:00.000Z'),
  endDate: new Date('2021-03-31T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_4_3',
  startDate: new Date('2021-03-31T19:00:00.000Z'),
  endDate: new Date('2021-03-31T20:00:00.000Z'),
  allDay: true,
}, {
  text: 'test_4_4',
  startDate: new Date('2021-03-31T19:00:00.000Z'),
  endDate: new Date('2021-03-31T20:00:00.000Z'),
  allDay: true,
}];

[
  'week',
  'month',
  'timelineWeek',
].forEach((currentView) => {
  test(`appointments should have correct height in ${currentView} view`, async (t) => {
    const {
      takeScreenshot,
      compareResults,
    } = createScreenshotsComparer(t);
    const scheduler = new Scheduler('#container');

    t
      .expect(await takeScreenshot(
        'maxAppointmentsPerCell-allDay.png',
        scheduler.element,
      ))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await restoreBrowserSize(t);
    await createWidget(
      'dxScheduler',
      {
        timeZone: 'America/Los_Angeles',
        maxAppointmentsPerCell: currentView.length,
        dataSource: data,
        views: ['week', 'month', 'timelineWeek'],
        currentView,
        currentDate: new Date('2021-03-28T18:00:00.000Z'),
        allDayPanelMode: 'allDay',
        startDayHour: 11,
        height: 834,
      },
      true,
    );
  });
});
