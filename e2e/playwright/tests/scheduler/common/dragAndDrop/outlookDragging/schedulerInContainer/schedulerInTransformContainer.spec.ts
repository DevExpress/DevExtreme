import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../../../../helpers/domUtils';
import { dragToOffset } from '../../../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

test('Dragging should be work right in case dxScheduler placed in container with transform style', async ({ page }) => {
  await setStyleAttribute(page, '#container', 'margin-top: 100px; margin-left: 100px; transform: translate(0px, 0px);');
  await appendElementTo(page, '#container', 'div', 'scheduler');

  await createWidget(page, 'dxScheduler', {
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

  const scheduler = new Scheduler(page, '#scheduler');
  const draggableAppointment = scheduler.getAppointmentByIndex(0);

  await dragToOffset(page, draggableAppointment.element, 0, 120);

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-bottom.png');

  await dragToOffset(page, draggableAppointment.element, 0, -170);

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-top.png');

  await dragToOffset(page, draggableAppointment.element, 100, 0);

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-right.png');

  await dragToOffset(page, draggableAppointment.element, -230, 0);

  await testScreenshot(page, 'dxScheduler-placed-in-transform-container-drag-to-left.png');
});
