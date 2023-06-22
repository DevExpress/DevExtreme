import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Scheduler from '../../../../model/scheduler';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';

fixture.disablePageReloads`Layout:Appointments:dragging`
  .page(url(__dirname, '../../../container.html'));

test('Short appointment dragging on minimal distance should be expected', async (t) => {
  const scheduler = new Scheduler('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.drag(scheduler.getAppointment('Test').element, -10, 0, { offsetX: 10 });

  await t
    .expect(await takeScreenshot('drag-short-app-min-dist-to-left.png', scheduler.element))
    .ok();

  await t.drag(scheduler.getAppointment('Test').element, 195, 0, { offsetX: 10 });

  await t
    .expect(await takeScreenshot('drag-short-app-to-right.png', scheduler.element))
    .ok();

  await t.drag(scheduler.getAppointment('Test').element, 200, 0, { offsetX: 10 });

  await t
    .expect(await takeScreenshot('drag-short-app-to-right-on-next-cell.png', scheduler.element))
    .ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxScheduler', {
    dataSource: [{
      text: 'Test',
      startDate: new Date(2021, 1, 2),
      endDate: new Date(2021, 1, 2, 1),
    }],
    views: ['timelineWeek'],
    currentView: 'timelineWeek',
    currentDate: new Date(2021, 1, 2),
    cellDuration: 1440,
    height: 300,
    with: 500,
  });
});
