import Scheduler from 'devextreme-testcafe-models/scheduler';
import type Appointment from 'devextreme-testcafe-models/scheduler/appointment';
import { createWidget } from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import { scrollTo } from '../../utils';

fixture.disablePageReloads`Scheduler Drag-and-Drop inside Group`
  .page(url(__dirname, '../../../container.html'));

const dragAppointmentByCircle = async (
  t: TestController,
  appointment: Appointment,
  times: string[],
) => {
  await t.drag(appointment.element, -200, 0)
    .expect(appointment.date.time)
    .eql(times[0]);

  await t.drag(appointment.element, 0, 200)
    .expect(appointment.date.time)
    .eql(times[1]);

  await t.drag(appointment.element, 200, 0)
    .expect(appointment.date.time)
    .eql(times[2]);

  await t.drag(appointment.element, 0, -200)
    .expect(appointment.date.time)
    .eql(times[3]);
};
const appointment1Times = ['9:00 AM - 10:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '10:00 AM - 11:00 AM'];
const appointment2Times = ['4:00 PM - 5:15 PM', '4:00 PM - 5:15 PM', '5:00 PM - 6:15 PM', '5:00 PM - 6:15 PM'];
const schedulerConfig = {
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
  views: ['timelineDay', 'timelineWorkWeek', 'timelineMonth'],
  currentView: 'timelineDay',
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
};

test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.exists).ok();

  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 1'), appointment1Times);
  await scrollTo(1400, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 2'), appointment2Times);

  await t.click(scheduler.toolbar.viewSwitcher.getButton('Timeline Work Week').element)
    .expect(scheduler.checkViewType('timelineWorkWeek'))
    .ok();
  await scrollTo(2400, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 1'), appointment1Times);
  await scrollTo(3400, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 2'), appointment2Times);
}).before(async () => createWidget('dxScheduler', schedulerConfig));

test('T1235433: Scheduler - Drag-n-Drop works inside the group with virtual scrolling (Timeline Month)', async (t) => {
  const scheduler = new Scheduler('#container');

  await t.expect(scheduler.element.exists).ok();

  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 1'), [
    '1: 1.1 - 1.2',
    '2: 1.1 - 1.2',
    '2: 1.2 - 1.3',
    '1: 1.2 - 1.3',
  ]);
  await scrollTo(1000, 0);
  await dragAppointmentByCircle(t, scheduler.getAppointment('Book 3'), [
    '1: 1.8 - 1.8',
    '2: 1.8 - 1.8',
    '2: 1.9 - 1.9',
    '1: 1.9 - 1.9',
  ]);
}).before(async () => createWidget('dxScheduler', {
  ...schedulerConfig,
  currentView: 'timelineMonth',
  appointmentTemplate({ appointmentData }) {
    return $(`
      <div style="display: contents">
        <div class="dx-scheduler-appointment-title">${appointmentData.text}</div>
        <div class="dx-scheduler-appointment-content-details">
          <div class="dx-scheduler-appointment-content-date">${appointmentData.priority}: ${appointmentData.startDate.getMonth()}.${appointmentData.startDate.getDate()} - ${appointmentData.endDate.getMonth()}.${appointmentData.endDate.getDate()}</div>
        </div>
      </div>
    `);
  },
}));
