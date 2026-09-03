import { expect, test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

test('Drag-n-drop between dateTable and allDay panel, groupByDate=true', async ({ page }) => {
  await createScheduler(page, {
    dataSource,
    groupByDate: true,
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Website Re-Design Plan');

  await dragToElement(page, draggableAppointment.element, scheduler.getAllDayTableCell(1));

  await expect(draggableAppointment.element).toBeAttached();
  await expect.poll(async () => draggableAppointment.isAllDay()).toBe(true);
});
