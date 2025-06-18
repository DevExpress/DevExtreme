import { test, expect } from '../../fixtures/fixtures';

const dataSource = [{
  text: 'Appointment',
  startDate: new Date(2020, 9, 14, 10, 0),
  endDate: new Date(2020, 9, 14, 10, 30),
}];

test('on escape - date should not changed when it\'s pressed during dragging (T832754)', async ({ page, dxScheduler }) => {
  const scheduler = await dxScheduler({
    _draggingMode: 'default',
    height: 600,
    views: ['day'],
    currentView: 'day',
    cellDuration: 30,
    dataSource,
    currentDate: dataSource[0].startDate,
    showAllDayPanel: false,
  });

  const appointment = scheduler.getAppointment('Appointment');
  const appointmentDate = scheduler.getAppointmentDate('Appointment');

  await appointment.hover();
  await page.mouse.down();
  await scheduler.getDateTableCell(4, 0).hover();
  await page.keyboard.press('Escape');
  await page.mouse.up();

  await expect(scheduler.dragSource()).toHaveCount(0);
  expect(await appointmentDate.innerText()).toEqual('10:00 AM - 10:30 AM');
});
