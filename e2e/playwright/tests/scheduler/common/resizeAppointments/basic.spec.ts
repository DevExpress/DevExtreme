import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

['day', 'week', 'workWeek'].forEach((view) => {
  test(`Resize in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToOffset(page, resizableAppointment.resizableHandle.bottom, 0, 100);
    await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 12:30 PM');
    await expect.poll(async () => (await resizableAppointment.getSize()).height).toBe('190px');

    await dragToOffset(page, resizableAppointment.resizableHandle.top, 0, 100);
    await expect(resizableAppointment.date.time).toHaveText('11:30 AM - 12:30 PM');
    await expect.poll(async () => (await resizableAppointment.getSize()).height).toBe('76px');

    await dragToOffset(page, resizableAppointment.resizableHandle.top, 0, -100);
    await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 12:30 PM');
    await expect.poll(async () => (await resizableAppointment.getSize()).height).toBe('190px');

    await dragToOffset(page, resizableAppointment.resizableHandle.bottom, 0, -100);
    await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 11:00 AM');
    await expect.poll(async () => (await resizableAppointment.getSize()).height).toBe('76px');
  });
});

test('Resize in the "month" view', async ({ page }) => {
  await createScheduler(page, {
    views: ['month'],
    currentView: 'month',
    dataSource,
  });

  const scheduler = new Scheduler(page, '#container');
  const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

  await dragToOffset(page, resizableAppointment.resizableHandle.right, 100, 0);
  await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 11:00 AM');
  await expect.poll(async () => (await resizableAppointment.getSize()).width).toBe('400px');

  await dragToOffset(page, resizableAppointment.resizableHandle.left, 100, 0);
  await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 11:00 AM');
  await expect.poll(async () => (await resizableAppointment.getSize()).width).toBe('200px');

  await dragToOffset(page, resizableAppointment.resizableHandle.left, -100, 0);
  await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 11:00 AM');
  await expect.poll(async () => (await resizableAppointment.getSize()).width).toBe('400px');

  await dragToOffset(page, resizableAppointment.resizableHandle.right, -100, 0);
  await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 11:00 AM');
  await expect.poll(async () => (await resizableAppointment.getSize()).width).toBe('200px');
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
  await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 12:30 PM');
  await expect.poll(async () => (await resizableAppointment.getSize()).height).toBe('190px');

  await dragToOffset(page, resizableAppointment.resizableHandle.top, 0, 100);
  await expect(resizableAppointment.date.time).toHaveText('11:30 AM - 12:30 PM');
  await expect.poll(async () => (await resizableAppointment.getSize()).height).toBe('76px');
});
