import { expect, test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import { dataSource } from './init/widget.data';
import createScheduler from './init/widget.setup';

test.describe('Drag-and-drop appointments in the Scheduler timeline views', () => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(0, 4));
    await expect(draggableAppointment.element).toHaveCSS('width', '200px');
    await expect(draggableAppointment.date).toHaveText('11:00 AM - 11:30 AM');
  }));

  test('Drag-n-drop in the "timelineMonth" view', async ({ page }) => {
    await createScheduler(page, {
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');
    const getHeight = async (): Promise<number> => parseInt(
      await draggableAppointment.element.evaluate((element) => getComputedStyle(element).height),
      10,
    );

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(0, 4));
    await expect.poll(getHeight).toBeGreaterThanOrEqual(139);
    await expect.poll(getHeight).toBeLessThanOrEqual(140);
    await expect(draggableAppointment.element).toHaveCSS('width', '200px');
    await expect(draggableAppointment.date).toHaveText('9:00 AM - 9:30 AM');
  });
});
