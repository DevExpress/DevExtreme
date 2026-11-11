import { expect, test } from '../../../../fixtures';
import { finishDrag, startDragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from './init/widget.setup';

const APPOINTMENT_DRAG_SOURCE_CLASS = '.dx-scheduler-appointment-drag-source';

test.describe('Cancel appointment Drag-and-Drop', () => {
  test('on escape - date should not changed when it\'s pressed during dragging (T832754)', async ({ page }) => {
    await createScheduler(page, {
      _draggingMode: 'default',
      height: 600,
      views: ['day'],
      currentView: 'day',
      cellDuration: 30,
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2020, 9, 14, 10, 0),
        endDate: new Date(2020, 9, 14, 10, 30),
      }],
      currentDate: new Date(2020, 9, 14),
      showAllDayPanel: false,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Appointment');

    await startDragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(4, 0));
    await page.keyboard.press('Escape');

    await finishDrag(page);

    await expect(scheduler.element.locator(APPOINTMENT_DRAG_SOURCE_CLASS)).not.toBeAttached();
    await expect(draggableAppointment.date).toHaveText('10:00 AM - 10:30 AM');
  });
});
