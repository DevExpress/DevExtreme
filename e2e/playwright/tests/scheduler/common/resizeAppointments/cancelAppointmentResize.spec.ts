import { expect, test } from '../../../../fixtures';
import { dragToOffset, finishDrag, startDragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import createScheduler from '../dragAndDrop/init/widget.setup';

const TIMELINE_DAY_OPTIONS = {
  timeZone: 'Etc/GMT',
  width: 400,
  currentDate: '2021-06-01T00:00:00Z',
  dataSource: [{
    text: 'Test Resize',
    startDate: '2021-06-01T01:00:00Z',
    endDate: '2021-06-01T20:00:00Z',
  }],
  views: [{
    type: 'timelineDay',
    intervalCount: 2,
  }],
  currentView: 'timelineDay',
  startDayHour: 0,
  cellDuration: 1440,
};

test('onAppointmentUpdating - newDate should be correct after cancel appointment resize and cellDuration=24h (T1070565)', async ({ page }) => {
  await createScheduler(page, {
    ...TIMELINE_DAY_OPTIONS,
    onAppointmentUpdating: (e) => {
      (window as any).newEndDate = e.newData.endDate;
      e.cancel = true;
    },
  });

  const scheduler = new Scheduler(page, '#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');
  const etalonEndDateIso = '2021-06-03T00:00:00Z';
  const readNewEndDate = () => page.evaluate(() => (window as any).newEndDate);

  // 1st iteration
  await dragToOffset(page, resizableAppointment.resizableHandle.right, 200, 0);
  await expect(resizableAppointment.date.time).toHaveText('1:00 AM - 8:00 PM');
  await expect.poll(readNewEndDate).toBe(etalonEndDateIso);

  // 2nd iteration
  await dragToOffset(page, resizableAppointment.resizableHandle.right, 200, 0);
  await expect(resizableAppointment.date.time).toHaveText('1:00 AM - 8:00 PM');
  await expect.poll(readNewEndDate).toBe(etalonEndDateIso);
});

test('on escape - date should not changed when it\'s pressed after resize (T1125615)', async ({ page }) => {
  await createScheduler(page, TIMELINE_DAY_OPTIONS);

  const scheduler = new Scheduler(page, '#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');

  await dragToOffset(page, resizableAppointment.resizableHandle.right, 50, 0);
  await expect(resizableAppointment.date.time).toHaveText('1:00 AM - 12:00 AM');

  await resizableAppointment.element.click();
  await page.keyboard.press('Escape');

  await dragToOffset(page, resizableAppointment.resizableHandle.right, 150, 0);
  await expect(resizableAppointment.date.time).toHaveText('1:00 AM - 12:00 AM');
});

test('on escape - date should not changed when it\'s pressed during resize (T1125615)', async ({ page }) => {
  await createScheduler(page, TIMELINE_DAY_OPTIONS);

  const scheduler = new Scheduler(page, '#container');
  const resizableAppointment = scheduler.getAppointment('Test Resize');

  // Escape has to arrive while the mouse is still down, which is what the TestCafe test got by
  // disabling the automation "_mouseup"; the button is released once the resize is cancelled.
  await startDragToOffset(page, resizableAppointment.resizableHandle.right, 150, 0);
  await page.keyboard.press('Escape');
  await finishDrag(page);

  await expect(resizableAppointment.date.time).toHaveText('1:00 AM - 8:00 PM');
});
