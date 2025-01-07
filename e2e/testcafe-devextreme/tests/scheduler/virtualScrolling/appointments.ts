import Scheduler from 'devextreme-testcafe-models/scheduler';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { getStyleAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { scrollTo } from './utils';

fixture.disablePageReloads`Scheduler: Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

test.skip('Appointment should not repaint after scrolling if present on viewport', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('', 0);

  await setStyleAttribute(element, 'background-color: red;');
  await t.expect(await getStyleAttribute(element)).eql('transform: translate(525px, 200px); width: 49px; height: 100px; background-color: red;');

  await scrollTo(new Date(2020, 8, 17, 4));

  await t.expect(await getStyleAttribute(element)).eql('transform: translate(525px, 200px); width: 49px; height: 100px; background-color: red;');
}).before(async () => {
  await createWidget('dxScheduler', {
    height: 600,
    width: 800,
    currentDate: new Date(2020, 8, 7),
    scrolling: {
      mode: 'virtual',
      orientation: 'both',
      outlineCount: 0,
    },
    currentView: 'week',
    views: [{
      type: 'week',
      intervalCount: 10,
    }],
    dataSource: [{
      startDate: new Date(2020, 8, 13, 2),
      endDate: new Date(2020, 8, 13, 3),
      text: 'test',
    }],
  });
});

test('The appointment should render correctly when scrolling vertically (T1263428)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await scrollTo(new Date('2024-11-12T09:00:00+0100'));

  await takeScreenshot('T1263428-virtual-scrolling-render-appointment.png', scheduler.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    height: 500,
    width: 900,
    timeZone: 'Europe/Vienna',
    dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ssxx',
    currentDate: new Date(2024, 10, 11, 20, 54, 23, 361),
    cellDuration: 20,
    firstDayOfWeek: 1,
    startDayHour: 12.0,
    endDayHour: 18.0,
    allDayPanelMode: 'hidden',
    scrolling: {
      mode: 'virtual',
    },
    crossScrollingEnabled: true,
    currentView: 'week',
    textExpr: 'Subject',
    startDateExpr: 'StartDate',
    endDateExpr: 'EndDate',
    views: [{
      type: 'week',
      groupByDate: true,
      startDayHour: 6.0,
      endDayHour: 22.0,
    }],
    dataSource: [{
      Subject: 'Website Re-Design Plan',
      StartDate: new Date('2024-11-11T12:10:00+0100'),
      EndDate: new Date('2024-11-12T21:00:00+0100'),
    }],
  });
});
