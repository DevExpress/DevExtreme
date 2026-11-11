import { expect, test } from '../../../../fixtures';
import { dragToOffset } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';

test.describe('Resize appointments in the Scheduler basic views', () => {
  ['timelineDay', 'timelineWeek', 'timelineWorkWeek'].forEach((view) => test(`Resize in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToOffset(page, resizableAppointment.resizableHandle.right, 400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '800px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 12:00 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.left, 400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '400px');
    await expect(resizableAppointment.date).toHaveText('11:00 AM - 12:00 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.left, -400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '800px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 12:00 PM');

    await dragToOffset(page, resizableAppointment.resizableHandle.right, -400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '400px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');
  }));

  test('Resize in the "timelineMonth" view', async ({ page }) => {
    await createScheduler(page, {
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const resizableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToOffset(page, resizableAppointment.resizableHandle.right, 400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '600px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');

    await dragToOffset(page, resizableAppointment.resizableHandle.left, 400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '200px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');

    await dragToOffset(page, resizableAppointment.resizableHandle.left, -400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '600px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');

    await dragToOffset(page, resizableAppointment.resizableHandle.right, -400, 0);
    await expect(resizableAppointment.element).toHaveCSS('width', '200px');
    await expect(resizableAppointment.date).toHaveText('10:00 AM - 11:00 AM');
  });

  test.describe('browser size 1400x800', () => {
    test.use({ browserSize: [1400, 800] });

    test('Resize appointment on timelineWeek view with custom startDayHour & endDayHour (T804779)', async ({ page }) => {
      await createScheduler(page, {
        views: [{
          type: 'timelineWeek', startDayHour: 10, endDayHour: 16, cellDuration: 60,
        }],
        currentView: 'timelineWeek',
        currentDate: new Date(2019, 8, 1),
        firstDayOfWeek: 0,
        dataSource: [{
          text: 'Appointment',
          startDate: new Date(2019, 8, 1, 14),
          endDate: new Date(2019, 8, 2, 11),
        }],
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Appointment');

      await dragToOffset(page, appointment.resizableHandle.right, -400, 0);
      await expect(appointment.element).toHaveCSS('width', '200px');
      await expect(appointment.date).toHaveText('2:00 PM - 3:00 PM');
    });
  });

  // T948164
  test('Resize should work correctly when cell\'s width is not an integer', async ({ page }) => {
    await createScheduler(page, {
      views: [{
        type: 'timelineDay',
        cellDuration: 120,
      }],
      currentView: 'timelineDay',
      currentDate: new Date(2020, 10, 13),
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2020, 10, 13, 0, 0),
        endDate: new Date(2020, 10, 13, 2, 0),
      }],
      width: 2999, // Cell's width in this case will not be an integer
      startDayHour: 0,
      endDayHour: 24,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');

    await dragToOffset(page, appointment.resizableHandle.right, 100, 0);
    await expect(appointment.date).toHaveText('12:00 AM - 4:00 AM');
  });

  test('Resize in the "timelineDay" view with start and end day hour (T1134583)', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2024, 0, 3, 9, 30),
        endDate: new Date(2024, 0, 3, 12, 30),
      }],
      views: [{
        type: 'timelineDay',
        intervalCount: 3,
      }],
      currentView: 'timelineDay',
      currentDate: new Date(2024, 0, 2),
      cellDuration: 60,
      startDayHour: 10,
      endDayHour: 12,
      width: 1200,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');

    await dragToOffset(page, appointment.resizableHandle.right, 200, 0);
    await expect(appointment.element).toHaveCSS('width', '600px');
    await expect(appointment.date).toHaveText('9:30 AM - 11:00 AM');

    await dragToOffset(page, appointment.resizableHandle.left, -200, 0);
    await expect(appointment.element).toHaveCSS('width', '800px');
    await expect(appointment.date).toHaveText('11:00 AM - 11:00 AM');
  });

  ['timelineWeek', 'timelineWorkWeek'].forEach((view) => {
    test(`Resize in the "${view}" view with start and end day hour (T1134583)`, async ({ page }) => {
      await createScheduler(page, {
        dataSource: [{
          text: 'Appointment',
          startDate: new Date(2024, 0, 3, 9, 30),
          endDate: new Date(2024, 0, 3, 12, 30),
        }],
        views: [view],
        currentView: view,
        currentDate: new Date(2024, 0, 2),
        cellDuration: 60,
        startDayHour: 10,
        endDayHour: 12,
      });

      const scheduler = new Scheduler(page, '#container');
      const appointment = scheduler.getAppointment('Appointment');

      await dragToOffset(page, appointment.resizableHandle.right, 200, 0);
      await expect(appointment.element).toHaveCSS('width', '600px');
      await expect(appointment.date).toHaveText('9:30 AM - 11:00 AM');

      await dragToOffset(page, appointment.resizableHandle.left, -200, 0);
      await expect(appointment.element).toHaveCSS('width', '800px');
      await expect(appointment.date).toHaveText('11:00 AM - 11:00 AM');
    });
  });

  test('Resize in the "timelineMonth" view with start and end day hour (T1134583)', async ({ page }) => {
    await createScheduler(page, {
      dataSource: [{
        text: 'Appointment',
        startDate: new Date(2024, 0, 3, 9, 30),
        endDate: new Date(2024, 0, 3, 12, 30),
      }],
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      currentDate: new Date(2024, 0, 2),
      cellDuration: 60,
      startDayHour: 10,
      endDayHour: 12,
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment('Appointment');

    await dragToOffset(page, appointment.resizableHandle.right, 200, 0);
    await expect(appointment.element).toHaveCSS('width', '400px');
    await expect(appointment.date).toHaveText('9:30 AM - 12:30 PM');

    await dragToOffset(page, appointment.resizableHandle.left, -200, 0);
    await expect(appointment.element).toHaveCSS('width', '600px');
    await expect(appointment.date).toHaveText('9:30 AM - 12:30 PM');
  });
});
