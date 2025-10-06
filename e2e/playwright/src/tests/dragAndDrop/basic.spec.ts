import { test, expect } from '../../fixtures/fixtures';

const dataSource = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2019, 3, 1, 9, 0),
    endDate: new Date(2019, 3, 1, 9, 30),
    resourceId: 0,
  },
  {
    text: 'Update NDA Agreement',
    startDate: new Date(2019, 3, 1, 9, 0),
    endDate: new Date(2019, 3, 1, 10, 0),
    resourceId: 1,
  },
  {
    text: 'Staff Productivity Report',
    startDate: new Date(2019, 3, 1, 9, 0),
    endDate: new Date(2019, 3, 1, 10, 30),
    resourceId: 2,
  },
];

test('Drag-n-drop in the "month" view', async ({ dxScheduler }) => {
  const scheduler = await dxScheduler({
    views: ['month'],
    currentView: 'month',
    dataSource,
    currentDate: dataSource[0].startDate,
    height: 834,
  });
  const appointment = scheduler.getAppointment('Brochure Design Review');
  const appointmentDate = scheduler.getAppointmentDate('Brochure Design Review');

  await appointment.dragTo(scheduler.getDateTableCell(0, 4));
  expect(
    await appointment.evaluate((node) => node.style.height),
  ).toEqual('23.75px');
  expect(await appointmentDate.innerText()).toEqual('9:00 AM - 9:30 AM');
});
