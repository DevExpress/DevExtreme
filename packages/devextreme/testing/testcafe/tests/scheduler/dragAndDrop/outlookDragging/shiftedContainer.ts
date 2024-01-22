import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { setStyleAttribute } from '../../../../helpers/domUtils';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Outlook dragging base tests in shifted container`
  .page(url(__dirname, '../../../container.html'));

test('Basic drag-n-drop movements in shifted container', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .drag(draggableAppointment.element, 100, 0, { speed: 0.5 })
    .expect(await takeScreenshot('drag-n-drop-to-right-in-shifted-container.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, -100, 0, { speed: 0.5 })
    .expect(await takeScreenshot('drag-n-drop-to-left-in-shifted-container.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, 100, { speed: 0.5 })
    .expect(await takeScreenshot('drag-n-drop-to-bottom-in-shifted-container.png', scheduler.workSpace))
    .ok()

    .drag(draggableAppointment.element, 0, -100, { speed: 0.5 })
    .expect(await takeScreenshot('drag-n-drop-to-top-in-shifted-container.png', scheduler.workSpace))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setStyleAttribute(Selector('#container'), 'margin-left: 50px; margin-top: 70px;');

  return createWidget('dxScheduler', {
    dataSource: [{
      text: 'Website Re-Design Plan',
      startDate: new Date(2021, 2, 22, 10),
      endDate: new Date(2021, 2, 22, 12, 30),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 22),
    startDayHour: 9,
    height: 600,
    width: 950,
  });
});
