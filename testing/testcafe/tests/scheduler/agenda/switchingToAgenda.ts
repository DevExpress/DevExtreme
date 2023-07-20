import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import Scheduler from '../../../model/scheduler';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Agenda:view switching`
  .page(url(__dirname, '../../container.html'));

test('View switching should work for empty agenda', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await scheduler.option('currentDate', new Date(2021, 4, 26));
  await scheduler.option('currentView', 'agenda');

  await t.expect(
    await takeScreenshot('switch-to-agenda-without-appointments.png'),
  ).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      startDate: new Date(2021, 4, 25, 0),
      endDate: new Date(2021, 4, 25, 1),
      text: 'Test Appointment',
    }],
    views: ['day', 'agenda'],
    currentView: 'day',
    currentDate: new Date(2021, 4, 25),
    height: 600,
  });
});
