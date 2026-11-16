import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

test.describe('Resize appointments in the Scheduler basic views', () => {
  ['day', 'week', 'workWeek'].forEach((view) => test(`Resize in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToOffset(page, resizableAppointment.resizableHandle.bottom, 0, 100);
    await expect(resizableAppointment.element).toHaveCSS('height', '190px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 12:30 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.top, 0, 100);
    await expect(resizableAppointment.element).toHaveCSS('height', '76px');
    await expect(resizableAppointment.date).toHaveText('11:30 AM - 12:30 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.top, 0, -100);
    await expect(resizableAppointment.element).toHaveCSS('height', '190px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 12:30 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.bottom, 0, -100);
    await expect(resizableAppointment.element).toHaveCSS('height', '76px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');
  }));

  test('Resize in the "month" view', async ({ page }) => {
    await createScheduler(page, {
      views: ['month'],
      currentView: 'month',
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToOffset(page, resizableAppointment.resizableHandle.right, 100, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '400px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');

    await dragToOffset(page, resizableAppointment.resizableHandle.left, 100, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '200px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');

    await dragToOffset(page, resizableAppointment.resizableHandle.left, -100, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '400px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');

    await dragToOffset(page, resizableAppointment.resizableHandle.right, -100, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '200px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');
  });

  test('Resize should work correctly with startDateExpr (T944693)', async ({ page }) => {
    await createScheduler(page, {
      views: ['week'],
      currentView: 'week',
      startDateExpr: 'start',
      dataSource: dataSource.map(({ startDate, ...restProps }) => ({
        ...restProps,
        start: startDate,
      })),
    });

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToOffset(page, resizableAppointment.resizableHandle.bottom, 0, 100);
    await expect(resizableAppointment.element).toHaveCSS('height', '190px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 12:30 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.top, 0, 100);
    await expect(resizableAppointment.element).toHaveCSS('height', '76px');
    await expect(resizableAppointment.date).toHaveText('11:30 AM - 12:30 PM');
  });
});
