import { test } from '../../../../../../fixtures';
import { createWidget } from '../../../../../../helpers/createWidget';
import { dragToOffset } from '../../../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../../../helpers/screenshots';
import Scheduler from '../../../../../../models/scheduler';

test('Dragging should be work right in case dxScheduler placed in dxTabPanel', async ({ page }) => {
  await createWidget(page, 'dxTabPanel', {
    items: [{
      title: 'Info',
      text: 'This is Info Tab',
    }, {
      title: 'Contacts',
      text: 'This is Contacts Tab',
      disabled: true,
    }],
    itemTemplate: () => ($('<div />') as any).dxScheduler({
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 2, 30, 11),
        endDate: new Date(2021, 2, 30, 12),
      }],
      views: ['week', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 28),
      startDayHour: 9,
      height: 600,
    }),
  });

  const scheduler = new Scheduler(page, '.dx-scheduler');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToOffset(page, draggableAppointment.element, 0, 120);

  await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-bottom.png');

  await dragToOffset(page, draggableAppointment.element, 0, -170);

  await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-top.png');

  await dragToOffset(page, draggableAppointment.element, 100, 0);

  await testScreenshot(page, 'dxScheduler-placed-in-dxTabPanel-drag-to-right.png');
});
