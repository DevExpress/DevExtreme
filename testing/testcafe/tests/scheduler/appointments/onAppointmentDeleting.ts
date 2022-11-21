import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

const data = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2021, 3, 27, 1, 30),
    endDate: new Date(2021, 3, 27, 2, 30),
  },
];

const createScheduler = (deletingOption: (e) => void) => ({
  dataSource: data,
  views: ['day'],
  currentView: 'day',
  currentDate: new Date(2021, 3, 27),
  startDayHour: 1,
  endDayHour: 7,
  height: 600,
  cellDuration: 30,
  onAppointmentDeleting: deletingOption,
});

const testOptions = (count: number) => async (t) => {
  const scheduler = new Scheduler('#container');
  const appointment = scheduler.getAppointment('Brochure Design Review');
  const { appointmentTooltip } = scheduler;

  await t
    .click(appointment.element, { speed: 0.1 })
    .expect(appointmentTooltip.exists)
    .ok()
    .click(appointmentTooltip.deleteButton, { speed: 0.1 })
    .expect(scheduler.getAppointmentCount())
    .eql(count);
};

fixture`Display* arguments in appointment templates and events`
  .page(url(__dirname, '../../container.html'));

test('should delete appointment if mode is "false"', testOptions(0)).before(async () => createWidget('dxScheduler', createScheduler((e) => {
  e.cancel = false;
}), true));

test('should delete appointment if mode is "true"', testOptions(1)).before(async () => createWidget('dxScheduler', createScheduler((e) => {
  e.cancel = true;
}), true));

test('should delete appointment if the Promise has been resolved', testOptions(0)).before(async () => createWidget('dxScheduler', createScheduler((e) => {
  e.cancel = new Promise((resolve) => {
    resolve(false);
  });
}), true));

test('should leave appointment if the Promise has been resolved', testOptions(1)).before(async () => createWidget('dxScheduler', createScheduler((e) => {
  e.cancel = new Promise((resolve) => {
    resolve(true);
  });
}), true));
