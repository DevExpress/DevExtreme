import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

test('T1325041: Appointment resize works with virtual scrolling enabled', async ({ page }) => {
  await createScheduler(page, {
    views: [{
      type: 'timelineWorkWeek',
      groupOrientation: 'vertical',
    }],
    currentView: 'timelineWorkWeek',
    dataSource,
    groups: ['resourceId'],
    scrolling: { mode: 'virtual' },
  });

  const scheduler = new Scheduler(page, '#container');
  const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

  await dragToOffset(page, resizableAppointment.resizableHandle.right, 400, 0);

  await expect(resizableAppointment.date.time).toHaveText('10:00 AM - 12:00 PM');
  await expect.poll(async () => (await resizableAppointment.getSize()).width).toBe('800px');
});
