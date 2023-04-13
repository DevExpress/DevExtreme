import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import {
  appendElementTo,
  setStyleAttribute,
} from '../../../../../helpers/domUtils';
import createWidget from '../../../../../helpers/createWidget';
import url from '../../../../../helpers/getPageUrl';
import Scheduler from '../../../../../model/scheduler';

fixture`Outlook dragging, for case scheduler in container with transform style`
  .page(url(__dirname, '../../../../container.html'));

test('Dragging should be work right in case dxScheduler placed in container with transform style', async (t) => {
  const scheduler = new Scheduler('#scheduler');

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const draggableAppointment = scheduler.getAppointmentByIndex(0);

  await t
    .drag(draggableAppointment.element, 0, 120)
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-bottom.png'))
    .ok()

    .drag(draggableAppointment.element, 0, -170)
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-top.png'))
    .ok()

    .drag(draggableAppointment.element, 100, 0)
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-right.png'))
    .ok()

    .drag(draggableAppointment.element, -230, 0)
    .expect(await takeScreenshot('dxScheduler-placed-in-transform-container-drag-to-left.png'))
    .ok()

    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setStyleAttribute(Selector('#container'), 'margin-top: 100px; margin-left: 100px; transform: translate(0px, 0px);');
  await appendElementTo('#container', 'div', 'scheduler');

  return createWidget('dxScheduler', {
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
  }, '#scheduler');
});
