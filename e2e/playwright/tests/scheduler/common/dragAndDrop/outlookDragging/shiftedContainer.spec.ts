import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { setStyleAttribute } from '../../../../../helpers/domUtils';
import { dragToOffset } from '../../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

test('Basic drag-n-drop movements in shifted container', async ({ page }) => {
  await setStyleAttribute(page, '#container', 'margin-left: 50px; margin-top: 70px;');

  await createWidget(page, 'dxScheduler', {
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

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 100, 0);

  await testScreenshot(page, 'drag-n-drop-to-right-in-shifted-container.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -100, 0);

  await testScreenshot(page, 'drag-n-drop-to-left-in-shifted-container.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, 100);

  await testScreenshot(page, 'drag-n-drop-to-bottom-in-shifted-container.png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, 0, -100);

  await testScreenshot(page, 'drag-n-drop-to-top-in-shifted-container.png', { element: scheduler.workSpace });
});
