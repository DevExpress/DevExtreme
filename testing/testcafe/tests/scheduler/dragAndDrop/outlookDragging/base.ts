import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import { createScreenshotsComparer } from '../../../../helpers/screenshot-comparer';

fixture`Outlook dragging base tests`
  .page(url(__dirname, '../../../container.html'));

test('Basic drag-n-drop movements', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 100, 0)
    .expect(await takeScreenshot('drag-n-drop-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -100, 0)
    .expect(await takeScreenshot('drag-n-drop-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 100)
    .expect(await takeScreenshot('drag-n-drop-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -100)
    .expect(await takeScreenshot('drag-n-drop-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 24, 10),
    endDate: new Date(2021, 4, 24, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements with mouse offset', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 100, 0, { offsetX: 10, offsetY: 200 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -100, 0, { offsetX: 10, offsetY: 200 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 100, { offsetX: 10, offsetY: 200 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-bottom.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -100, { offsetX: 10, offsetY: 200 })
    .expect(await takeScreenshot('drag-n-drop-mouse-offset-to-top.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 24, 10),
    endDate: new Date(2021, 4, 24, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));

test('Basic drag-n-drop movements within the cell', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 50, 0)
    .expect(await takeScreenshot('drag-n-drop-within-cell-to-right.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -50, 0)
    .expect(await takeScreenshot('drag-n-drop-within-cell-to-left.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 30)
    .expect(await takeScreenshot('drag-n-drop-within-cell-to-bottom.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(() => createWidget('dxScheduler', {
  dataSource: [{
    text: 'Website Re-Design Plan',
    startDate: new Date(2021, 4, 24, 10),
    endDate: new Date(2021, 4, 24, 12, 30),
  }],
  views: ['week'],
  currentView: 'week',
  currentDate: new Date(2021, 4, 27),
  startDayHour: 9,
  height: 600,
  width: 1000,
}));
