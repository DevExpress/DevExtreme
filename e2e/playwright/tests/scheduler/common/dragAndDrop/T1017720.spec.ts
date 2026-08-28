import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

test('Drag-n-drop appointment above SVG element(T1017720)', async ({ page }) => {
  await createWidget(page, 'dxChart', {
    width: '100%',
    height: 1300,
    series: {
      type: 'bar',
      color: '#ffaa66',
    },
  });

  await createWidget(page, 'dxPopup', {
    width: '90%',
    height: '90%',
    visible: true,
    contentTemplate: () => {
      const scheduler = $('<div id="scheduler" />');

      (scheduler as any).dxScheduler({
        width: '100%',
        height: '100%',
        startDayHour: 11,
        dataSource: [{
          text: 'text',
          startDate: new Date(2021, 6, 27, 11),
          endDate: new Date(2021, 6, 27, 14),
          allDay: false,
        }],
        views: ['week'],
        currentDate: new Date(2021, 6, 27, 12),
        currentView: 'week',
      });

      return scheduler;
    },
  });

  const scheduler = new Scheduler(page, '#scheduler');
  const draggableAppointment = scheduler.getAppointment('text');

  await dragToOffset(page, draggableAppointment.element, 330, 0);

  await testScreenshot(page, 'drag-n-drop-to-right(T1017720).png', { element: scheduler.workSpace });

  await dragToOffset(page, draggableAppointment.element, -330, 70);

  await testScreenshot(page, 'drag-n-drop-to-left(T1017720).png', { element: scheduler.workSpace });
});
