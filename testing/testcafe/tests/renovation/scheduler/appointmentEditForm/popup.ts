import Scheduler from '../../../../model/scheduler';
import { multiPlatformTest, createWidget } from '../../../../helpers/multi-platform-test';

const SCHEDULER_SELECTOR = '#container';

const test = multiPlatformTest({
  page: 'declaration/scheduler',
  // TODO should be uncommented after fix popup content render in Inferno
  platforms: [/* 'jquery', */'react'],
});

fixture('Renovated scheduler - Appointment popup');

test('Popup should have correct width', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);
  const appointment = scheduler.getAppointmentByIndex(0);

  await t
    .resizeWindow(1200, 800)
    .doubleClick(appointment.element)
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .expect(scheduler.appointmentPopup.isVisible())
    .ok()
    .expect(scheduler.appointmentPopup.element.clientWidth)
    .eql(400)
    .expect(scheduler.appointmentPopup.fullScreen)
    .notOk()
    .click(scheduler.appointmentPopup.cancelButton);

  await t
    .resizeWindow(500, 800)
    .doubleClick(appointment.element)
    .expect(scheduler.appointmentPopup.element.exists)
    .ok()
    .expect(scheduler.appointmentPopup.isVisible())
    .ok()
    .expect(scheduler.appointmentPopup.fullScreen)
    .ok();
}).before(
  async (_, { platform }) => createWidget(platform, 'dxScheduler', {
    dataSource: [{
      startDate: new Date(2021, 2, 28, 10),
      endDate: new Date(2021, 2, 28, 12),
    }],
    views: ['day'],
    currentView: 'day',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    width: 400,
    height: 600,
  }),
);
