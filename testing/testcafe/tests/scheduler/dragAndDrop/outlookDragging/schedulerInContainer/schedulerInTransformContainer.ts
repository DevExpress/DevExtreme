import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import { createScreenshotsComparer } from '../../../../../helpers/screenshot-comparer';
import Scheduler from '../../../../../model/scheduler';

fixture`Outlook dragging, for case scheduler in container with transform style`
  .page(url(__dirname, './containerWithTransform.html'));

test('Dragging should be work right in case dxScheduler placed in container with transform style', async (t) => {
  const scheduler = new Scheduler('.dx-scheduler');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await t
    .drag(draggableAppointment.element, 0, 120, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-bottom.png'))
    .ok()

    .drag(draggableAppointment.element, 0, -170, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-top.png'))
    .ok()

    .drag(draggableAppointment.element, 100, 0, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-right.png'))
    .ok()

    .drag(draggableAppointment.element, -230, 0, { speed: 0.1 })
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-left.png'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 2, 24, 11),
    endDate: new Date(2021, 2, 24, 12),
  }],
  views: ['workWeek'],
  currentView: 'workWeek',
  currentDate: new Date(2021, 2, 22),
  startDayHour: 9,
  height: 600,
  width: 800,
}));
