import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';

const SCHEDULER_SELECTOR = '#container';
const EVENT_BOX_SELECTOR = '#event-text-box';

fixture`T1118059`
  .page(url(__dirname, './pages/T1118059.html'));

test('After drag to draggable component, should be called onAppointmentDeleting event only', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .dragToElement(scheduler.getAppointment('Regular test app').element, Selector('#drag-container'));

  await t
    .expect(Selector(EVENT_BOX_SELECTOR).innerText)
    .eql('onAppointmentDeleting');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'All day test app 1',
    startDate: new Date(2021, 3, 26),
    endDate: new Date(2021, 3, 26),
    allDay: true,
  }, {
    text: 'All day test app 2',
    startDate: new Date(2021, 3, 27),
    endDate: new Date(2021, 3, 27),
    allDay: true,
  }, {
    text: 'Regular test app',
    startDate: new Date(2021, 3, 27, 10, 30),
    endDate: new Date(2021, 3, 27, 11),
  }],
  views: [{
    type: 'day',
    intervalCount: 2,
  }],
  onAppointmentUpdated() {
    document.querySelector(EVENT_BOX_SELECTOR)!.innerHTML = 'onAppointmentUpdated';
  },
  onAppointmentUpdating() {
    document.querySelector(EVENT_BOX_SELECTOR)!.innerHTML = 'onAppointmentUpdating';
  },
  onAppointmentDeleting() {
    document.querySelector(EVENT_BOX_SELECTOR)!.innerHTML = 'onAppointmentDeleting';
  },
  currentDate: new Date(2021, 3, 26),
  startDayHour: 9,
  height: 600,
  width: 500,
  appointmentDragging: {
    group: 'appointmentsGroup',
    onRemove(e) {
      e.component.deleteAppointment(e.itemData);
    },
  },
}, true));

test('After drag over component area, shouldn\'t called onAppointment* data events and appointment shouldn\'t change position', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .dragToElement(scheduler.getAppointment('All day test app 2').element, Selector('#space-right'));
  await t
    .expect(Selector(EVENT_BOX_SELECTOR).innerText)
    .eql('')
    .expect(scheduler.getAppointment('All day test app 2').date.time)
    .eql('12:00 AM - 12:01 AM');

  await t
    .dragToElement(scheduler.getAppointment('Regular test app').element, Selector('#left-right'));
  await t
    .expect(Selector(EVENT_BOX_SELECTOR).innerText)
    .eql('')
    .expect(scheduler.getAppointment('Regular test app').date.time)
    .eql('10:30 AM - 11:00 AM');
}).before(async () => createWidget('dxScheduler', {
  dataSource: [{
    text: 'All day test app 1',
    startDate: new Date(2021, 3, 26),
    endDate: new Date(2021, 3, 26),
    allDay: true,
  }, {
    text: 'All day test app 2',
    startDate: new Date(2021, 3, 27),
    endDate: new Date(2021, 3, 27),
    allDay: true,
  }, {
    text: 'Regular test app',
    startDate: new Date(2021, 3, 27, 10, 30),
    endDate: new Date(2021, 3, 27, 11),
  }],
  views: [{
    type: 'day',
    intervalCount: 2,
  }],
  onAppointmentUpdated() {
    document.querySelector(EVENT_BOX_SELECTOR)!.innerHTML = 'onAppointmentUpdated';
  },
  onAppointmentUpdating() {
    document.querySelector(EVENT_BOX_SELECTOR)!.innerHTML = 'onAppointmentUpdating';
  },
  onAppointmentDeleting() {
    document.querySelector(EVENT_BOX_SELECTOR)!.innerHTML = 'onAppointmentDeleting';
  },
  currentDate: new Date(2021, 3, 26),
  startDayHour: 9,
  height: 600,
  width: 500,
}, true));
