import { expect, test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import { dataSource } from './init/widget.data';
import createScheduler from './init/widget.setup';

['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => {
  test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(0, 4));

    await expect(draggableAppointment.date.time).toHaveText('11:00 AM - 11:30 AM');
    await expect.poll(async () => (await draggableAppointment.getSize()).width).toBe('200px');
  });
});

test('Drag-n-drop in the "timelineMonth" view', async ({ page }) => {
  await createScheduler(page, {
    views: ['timelineMonth'],
    currentView: 'timelineMonth',
    dataSource,
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

  await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(0, 4));

  await expect(draggableAppointment.date.time).toHaveText('9:00 AM - 9:30 AM');
  await expect.poll(async () => (await draggableAppointment.getSize()).width).toBe('200px');

  const height = parseInt((await draggableAppointment.getSize()).height, 10);

  expect(height).toBeGreaterThanOrEqual(139);
  expect(height).toBeLessThanOrEqual(140);
});
