import { simpleData, allDayData } from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture`Appointment overlapping in Scheduler`
  .page(url(__dirname, '../../container.html'));

test('Multi-day appointment should not overlap other appointments when specific width is set, \'auto\' mode (T864456)', async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Appointment 1', 1);

  await t
    .expect(scheduler.getAppointmentCollectorCount()).eql(3)
    .expect(appointment.size.height).eql('350px')
    .expect(appointment.size.width)
    .eql('93px');
}).before(async () => createScheduler({
  dataSource: simpleData,
}));

test('Simple appointment should not overlap allDay appointment when specific width is set, \'auto\' mode (T864456)', async (t) => {
  const scheduler = new Scheduler('#container');
  const { element } = scheduler.getAppointment('Appointment 4');

  await t
    .expect(scheduler.getAppointmentCollectorCount()).eql(0)
    .expect(await element.getBoundingClientRectProperty('top')).eql(114);
}).before(async () => createScheduler({
  dataSource: allDayData,
}));

test('Crossing allDay appointments should not overlap each other (T893674)', async (t) => {
  const scheduler = new Scheduler('#container');
  const firstAppointment = scheduler.getAppointment('Appointment 1');
  const secondAppointment = scheduler.getAppointment('Appointment 2');

  await t
    .expect(await firstAppointment.element.getBoundingClientRectProperty('top')).notEql(await secondAppointment.element.getBoundingClientRectProperty('top'));
}).before(async () => createScheduler({
  dataSource: allDayData,
}));
