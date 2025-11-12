import Scheduler from 'devextreme-testcafe-models/scheduler';
import type Appointment from 'devextreme-testcafe-models/scheduler/appointment';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { Themes } from '../../../../helpers/themes';
import { scrollTo } from '../../helpers/utils';

fixture.disablePageReloads`Scheduler Drag-and-Drop inside Group`
  .page(url(__dirname, '../../../container.html'));

const createScheduler = (view: string) => createWidget('dxScheduler', {
  timeZone: 'America/Los_Angeles',
  dataSource: [
    {
      text: 'Book 1',
      startDate: new Date('2021-02-02T18:00:00.000Z'),
      endDate: new Date('2021-02-02T19:00:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 2',
      startDate: new Date('2021-02-03T01:00:00.000Z'),
      endDate: new Date('2021-02-03T02:15:00.000Z'),
      priority: 1,
    }, {
      text: 'Book 3',
      startDate: new Date('2021-02-09T01:00:00.000Z'),
      endDate: new Date('2021-02-09T02:15:00.000Z'),
      priority: 1,
    },
  ],
  views: [view],
  currentView: view,
  currentDate: new Date('2021-02-02T17:00:00.000Z'),
  firstDayOfWeek: 0,
  scrolling: { mode: 'virtual' },
  startDayHour: 8,
  endDayHour: 20,
  cellDuration: 60,
  groups: ['priority'],
  useDropDownViewSwitcher: false,
  resources: [{
    fieldExpr: 'priority',
    dataSource: [
      { id: 1, text: 'Low Priority', color: 'green' },
      { id: 2, text: 'High Priority', color: 'blue' },
    ],
    label: 'Priority',
  }],
  height: 580,
});
const dragAppointmentByCircle = async (
  t: TestController,
  appointment: Appointment,
  label: string[],
  description: string[],
) => {
  await t.drag(appointment.element, -200, 0);
  await t.expect(appointment.getAriaLabel())
    .contains(label[0])
    .expect(await appointment.getAriaDescription())
    .contains(description[0]);

  await t.drag(appointment.element, 0, 200);
  await t.expect(appointment.getAriaLabel())
    .contains(label[1])
    .expect(await appointment.getAriaDescription())
    .contains(description[1]);

  await t.drag(appointment.element, 200, 0);
  await t.expect(appointment.getAriaLabel())
    .contains(label[2])
    .expect(await appointment.getAriaDescription())
    .contains(description[2]);

  await t.drag(appointment.element, 0, -200);
  await t.expect(appointment.getAriaLabel())
    .contains(label[3])
    .expect(await appointment.getAriaDescription())
    .contains(description[3]);
};
const appointmentDescriptions = ['Group: Low Priority', 'Group: High Priority', 'Group: High Priority', 'Group: Low Priority'];
const appointment1Times = ['9:00 AM - 10:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '10:00 AM - 11:00 AM'];
const appointment2Times = ['4:00 PM - 5:15 PM', '4:00 PM - 5:15 PM', '5:00 PM - 6:15 PM', '5:00 PM - 6:15 PM'];

test.meta({ runInTheme: Themes.genericLight })('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineDay)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.exists).ok();

  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 1'), appointment1Times, appointmentDescriptions);
  await scrollTo(1400, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 2'), appointment2Times, appointmentDescriptions);
}).before(async () => createScheduler('timelineDay'));

test.meta({ runInTheme: Themes.genericLight })('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineWorkWeek)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.exists).ok();

  await scrollTo(2400, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 1'), appointment1Times, appointmentDescriptions);
  await scrollTo(3400, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 2'), appointment2Times, appointmentDescriptions);
}).before(async () => createScheduler('timelineWorkWeek'));

test.meta({ runInTheme: Themes.genericLight })('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (timelineMonth)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.exists).ok();

  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 1'), [
    'February 1, 2021',
    'February 1, 2021',
    'February 2, 2021',
    'February 2, 2021',
  ], appointmentDescriptions);
  await scrollTo(1000, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 3'), [
    'February 7, 2021',
    'February 7, 2021',
    'February 8, 2021',
    'February 8, 2021',
  ], appointmentDescriptions);
}).before(async () => createScheduler('timelineMonth'));
