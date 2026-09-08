import { expect, test } from '../../../../fixtures';
import { dragToElement, dragToOffset } from '../../../../helpers/dragUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import { dataSource } from './init/widget.data';
import createScheduler from './init/widget.setup';

['day', 'week', 'workWeek'].forEach((view) => {
  test(`Drag-n-drop in the "${view}" view`, async ({ page }) => {
    await createScheduler(page, {
      views: [view],
      currentView: view,
      dataSource,
    });

    const scheduler = new Scheduler(page, '#container');
    const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

    await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(4, 0));

    await expect(draggableAppointment.date.time).toHaveText('11:00 AM - 11:30 AM');
    await expect
      .poll(async () => (await draggableAppointment.getSize()).height)
      .toBe('38px');
  });
});

test('Drag-n-drop in the "month" view', async ({ page }) => {
  await createScheduler(page, {
    views: ['month'],
    currentView: 'month',
    dataSource,
    height: 834,
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Brochure Design Review');

  await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(0, 4));

  await expect(draggableAppointment.date.time).toHaveText('9:00 AM - 9:30 AM');
  await expect
    .poll(async () => (await draggableAppointment.getSize()).height)
    .toBe('23.8281px');
});

test('Drag-n-drop when browser has horizontal scroll', async ({ page }) => {
  await createScheduler(page, {
    views: ['week'],
    currentView: 'week',
    dataSource: [{
      text: 'Staff Productivity Report',
      startDate: new Date(2019, 3, 6, 9, 0),
      endDate: new Date(2019, 3, 6, 10, 30),
      resourceId: 2,
    }],
    width: 1800,
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Staff Productivity Report');

  await dragToOffset(page, draggableAppointment.element, 250, -50);

  await expect.poll(async () => draggableAppointment.isAllDay()).toBe(true);
});

test('Drag-n-drop when browser has vertical scroll', async ({ page }) => {
  await createScheduler(page, {
    views: ['week'],
    currentView: 'week',
    dataSource: [{
      text: 'Staff Productivity Report',
      startDate: new Date(2019, 3, 1, 21, 0),
      endDate: new Date(2019, 3, 1, 21, 30),
      resourceId: 2,
    }],
    height: 1800,
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Staff Productivity Report');

  await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(25, 0));

  await expect(draggableAppointment.date.time).toHaveText('9:30 PM - 10:00 PM');
});

test('Drag recurrent appointment occurrence from collector (T832887)', async ({ page }) => {
  await createScheduler(page, {
    views: ['week'],
    currentView: 'week',
    firstDayOfWeek: 2,
    startDayHour: 4,
    maxAppointmentsPerCell: 1,
    dataSource: [{
      text: 'Recurrence one',
      startDate: new Date(2019, 2, 26, 8, 0),
      endDate: new Date(2019, 2, 26, 10, 0),
      recurrenceException: '',
      recurrenceRule: 'FREQ=DAILY',
    }, {
      text: 'Non-recurrent appointment',
      startDate: new Date(2019, 2, 26, 7, 0),
      endDate: new Date(2019, 2, 26, 11, 0),
    }, {
      text: 'Recurrence two',
      startDate: new Date(2019, 2, 26, 8, 0),
      endDate: new Date(2019, 2, 26, 10, 0),
      recurrenceException: '',
      recurrenceRule: 'FREQ=DAILY',
    }],
    currentDate: new Date(2019, 2, 26),
  });

  const scheduler = new Scheduler(page, '#container');
  const appointment = scheduler.getAppointment('Recurrence two');
  const collector = scheduler.collectors.find('2');
  const { appointmentTooltip } = scheduler;
  const appointmentTooltipItem = appointmentTooltip.getListItem('Recurrence two');
  const popup = Scheduler.getDeleteRecurrenceDialog(page);

  await collector.element.click();
  await expect(appointmentTooltip.wrapper).toBeVisible();

  await dragToElement(page, appointmentTooltipItem.element, scheduler.getDateTableCell(2, 2));

  await expect(appointmentTooltipItem.element).toHaveCount(0);

  await popup.appointment.click();

  await expect(appointment.element).toHaveCount(1);
  await expect(appointment.date.time).toHaveText('4:00 AM - 6:00 AM');
  await expect(collector.element).toHaveCount(0);
});

test('Drag-n-drop the appointment to the left column to the cell that has the same time', async ({ page }) => {
  await createScheduler(page, {
    timeZone: 'Etc/GMT',
    dataSource: [{
      text: 'Test appointment',
      startDate: new Date('2022-09-08T10:00:00.000Z'),
      endDate: new Date('2022-09-08T10:30:00.000Z'),
    }],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date('2022-09-09T10:00:00.000Z'),
    startDayHour: 9,
    width: 600,
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');
  const draggableAppointment = scheduler.getAppointment('Test appointment');

  await dragToElement(page, draggableAppointment.element, scheduler.getDateTableCell(2, 2));

  await testScreenshot(page, 'drag-n-drop-appointment-to-left-column.png', {
    element: scheduler.workSpace,
  });
});
