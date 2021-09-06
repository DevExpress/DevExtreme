import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Appointments collector`
  .page(url(__dirname, '../../../container.html'));

test('Appointment collector has correct offset when adaptivityEnabled=true', async (t) => {
  const scheduler = new Scheduler('#container');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot('appointment-collector-adaptability-timelineMonth.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
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
}));
