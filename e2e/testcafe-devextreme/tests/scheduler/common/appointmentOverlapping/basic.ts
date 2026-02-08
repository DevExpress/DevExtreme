import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { Themes } from '../../../../helpers/themes';

fixture.disablePageReloads`Appointment overlapping in Scheduler`
  .page(url(__dirname, '../../../container.html'));

export const SIMPLE_DATA = [
  {
    text: 'Appointment 1',
    startDate: new Date(2017, 4, 24, 13, 0),
    endDate: new Date(2017, 4, 25, 12, 30),
  },
  {
    text: 'Appointment 2',
    startDate: new Date(2017, 4, 24, 15, 0),
    endDate: new Date(2017, 4, 24, 16, 30),
  },
  {
    text: 'Appointment 3',
    startDate: new Date(2017, 4, 25, 9, 0),
    endDate: new Date(2017, 4, 25, 10, 30),
  },
  {
    text: 'Appointment 4',
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 30),
  },
  {
    text: 'Appointment 5',
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 0),
    allDay: true,
  },
];

export const ALL_DAY_DATA = [
  {
    text: 'Appointment 1',
    startDate: new Date(2017, 4, 21, 9, 0),
    endDate: new Date(2017, 4, 24, 10, 30),
    allDay: true,
  },
  {
    text: 'Appointment 2',
    startDate: new Date(2017, 4, 22, 11, 0),
    endDate: new Date(2017, 4, 22, 12, 0),
    allDay: true,
  },
  {
    text: 'Appointment 3',
    startDate: new Date(2017, 4, 25, 9, 0),
    endDate: new Date(2017, 4, 25, 10, 30),
  },
  {
    text: 'Appointment 4',
    startDate: new Date(2017, 4, 25, 11, 0),
    endDate: new Date(2017, 4, 25, 12, 0),
    allDay: true,
  },
];

const SCHEDULER_DEFAULT_OPTIONS = {
  views: ['week'],
  width: 940,
  currentView: 'week',
  currentDate: new Date(2017, 4, 25),
  startDayHour: 9,
  height: 900,
};

test('Multi-day appointment should not overlap other appointments when specific width is set, \'auto\' mode (T864456)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Appointment 1', 1);

  await t
    .expect(scheduler.collectors.count).eql(3)

    .expect(parseInt(await appointment.size.height, 10))
    .eql(266)

    .expect(parseInt(await appointment.size.width, 10))
    .eql(94);
}).before(async () => createWidget('dxScheduler', {
  ...SCHEDULER_DEFAULT_OPTIONS,
  dataSource: SIMPLE_DATA,
}));

test('Simple appointment should not overlap allDay appointment when specific width is set, \'auto\' mode (T864456)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('Appointment 4');

  await t
    .expect(scheduler.collectors.count).eql(1)
    .expect(await element.getBoundingClientRectProperty('top')).eql(108.828125);
}).before(async () => createWidget('dxScheduler', {
  ...SCHEDULER_DEFAULT_OPTIONS,
  dataSource: ALL_DAY_DATA,
}));

test.meta({ runInTheme: Themes.genericLight })('Crossing allDay appointments should not overlap each other (T893674)', async (t) => {
  const scheduler = new Scheduler('#container');
  const firstAppointment = scheduler.getAppointment('Appointment 1');
  const secondAppointment = scheduler.getAppointment('Appointment 2');

  await t
    .expect(await firstAppointment.element.getBoundingClientRectProperty('top')).notEql(await secondAppointment.element.getBoundingClientRectProperty('top'));
}).before(async () => createWidget('dxScheduler', {
  ...SCHEDULER_DEFAULT_OPTIONS,
  dataSource: ALL_DAY_DATA,
}));
