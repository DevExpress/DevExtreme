import { createScreenshotsComparer } from '../../../helpers/screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Layout:BrowserResize`
  .page(url(__dirname, '../../container.html'));

const data = [{
  text: 'Website Re-Design Plan',
  startDate: new Date(2017, 4, 22, 9, 30),
  endDate: new Date(2017, 4, 22, 11, 30),
  roomId: 1,
}, {
  text: 'Book Flights to San Fran for Sales Trip',
  startDate: new Date(2017, 4, 22, 12, 0),
  endDate: new Date(2017, 4, 22, 13, 0),
  allDay: true,
  roomId: 2,
}, {
  text: 'Install New Router in Dev Room',
  startDate: new Date(2017, 4, 22, 14, 30),
  endDate: new Date(2017, 4, 22, 15, 30),
  roomId: 3,
}, {
  text: 'Approve Personal Computer Upgrade Plan',
  startDate: new Date(2017, 4, 23, 10, 0),
  endDate: new Date(2017, 4, 23, 11, 0),
}, {
  text: 'Final Budget Review',
  startDate: new Date(2017, 4, 23, 12, 0),
  endDate: new Date(2017, 4, 23, 13, 35),
  roomId: 1,
}, {
  text: 'New Brochures',
  startDate: new Date(2017, 4, 23, 14, 30),
  endDate: new Date(2017, 4, 23, 15, 45),
  roomId: 2,
}, {
  text: 'Install New Database',
  startDate: new Date(2017, 4, 24, 9, 45),
  endDate: new Date(2017, 4, 24, 11, 15),
  roomId: 1,
}, {
  text: 'Approve New Online Marketing Strategy',
  startDate: new Date(2017, 4, 24, 12, 0),
  endDate: new Date(2017, 4, 24, 14, 0),
}, {
  text: 'Upgrade Personal Computers',
  startDate: new Date(2017, 4, 24, 15, 15),
  endDate: new Date(2017, 4, 24, 16, 30),
  roomId: 1,
}, {
  text: 'Customer Workshop',
  startDate: new Date(2017, 4, 25, 11, 0),
  endDate: new Date(2017, 4, 25, 12, 0),
  allDay: true,
}, {
  text: 'Prepare 2015 Marketing Plan',
  startDate: new Date(2017, 4, 25, 11, 0),
  endDate: new Date(2017, 4, 25, 13, 30),
}, {
  text: 'Brochure Design Review',
  startDate: new Date(2017, 4, 25, 14, 0),
  endDate: new Date(2017, 4, 25, 15, 30),
  roomId: 3,
}, {
  text: 'Create Icons for Website',
  startDate: new Date(2017, 4, 26, 10, 0),
  endDate: new Date(2017, 4, 26, 11, 30),
  roomId: 2,
}, {
  text: 'Upgrade Server Hardware',
  startDate: new Date(2017, 4, 26, 14, 30),
  endDate: new Date(2017, 4, 26, 16, 0),
}, {
  text: 'Submit New Website Design',
  startDate: new Date(2017, 4, 26, 16, 30),
  endDate: new Date(2017, 4, 26, 18, 0),
}, {
  text: 'Launch New Website',
  startDate: new Date(2017, 4, 26, 12, 20),
  endDate: new Date(2017, 4, 26, 14, 0),
}];

const resourceDataSource = [{
  text: 'Room 1',
  id: 1,
  color: '#00af2c',
}, {
  text: 'Room 2',
  id: 2,
  color: '#56ca85',
}, {
  text: 'Room 3',
  id: 3,
  color: '#8ecd3c',
}];

[{
  currentView: 'agenda',
  currentDate: new Date(2017, 4, 25),
}, {
  currentView: 'day',
  currentDate: new Date(2017, 4, 25),
}, {
  currentView: 'week',
  currentDate: new Date(2017, 4, 25),
}, {
  currentView: 'month',
  currentDate: new Date(2017, 4, 25),
}, {
  currentView: 'timelineDay',
  currentDate: new Date(2017, 4, 26),
}].forEach(({ currentView, currentDate }) => {
  test(`Appointment layout after resize should be rendered right in '${currentView}'`, async (t) => {
    const scheduler = new Scheduler('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`browser-resize-currentView=${currentView}-before-resize.png`, scheduler.workSpace))
      .ok();

    await t.resizeWindow(600, 600);

    await t
      .expect(await takeScreenshot(`browser-resize-currentView=${currentView}-after-resize.png`, scheduler.workSpace))
      .ok()

      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxScheduler', {
      dataSource: data,
      views: [currentView],
      currentView,
      currentDate,
      resources: [{
        fieldExpr: 'roomId',
        dataSource: resourceDataSource,
      }],
      startDayHour: 9,
      height: 600,
    });
  }).after(async (t) => {
    await t.resizeWindow(1200, 800);
  });
});
