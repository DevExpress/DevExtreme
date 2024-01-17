import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import createWidget from '../../../helpers/createWidget';
import {
  setStyleAttribute,
} from '../../../helpers/domUtils';

const SCHEDULER_SELECTOR = '#scheduler';

// eslint-disable-next-line no-multi-str
const markup = '<div style="display: flex;">\
  <div id="drag-container" style="background: red; width: 250px; height: 150px;">drag container</div>\
  <div id="space-right" style="background: yellow; width: 400px; height: 150px;">top right space</div>\
</div>\
<div style="display: flex;">\
  <div id="left-right" style="background: yellow; width: 250px; height: 550px;">left space</div>\
  <div id="scheduler"></div>\
</div>';

fixture`T1118059`
  .page(url(__dirname, '../../container.html'));

const safeEvent = (value) => ClientFunction(() => {
  (window as any).eventName = value;
}, { dependencies: { value } });

test('After drag to draggable component, should be called onAppointmentDeleting event only', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .dragToElement(scheduler.getAppointment('Regular test app').element, Selector('#drag-container'), { speed: 0.5 });

  await t
    .expect(ClientFunction(() => (window as any).eventName)())
    .eql('onAppointmentDeleting');
}).before(async () => {
  safeEvent('');
  await setStyleAttribute(Selector('#container'), 'display: flex; flex-direction: column;');

  await ClientFunction(() => {
    $('#container').append(markup);
  }, { dependencies: { markup } })();

  await createWidget('dxDraggable', {
    group: 'appointmentsGroup',
  }, '#drag-container');

  return createWidget('dxScheduler', {
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
    onAppointmentUpdated: safeEvent('onAppointmentUpdated'),
    onAppointmentUpdating: safeEvent('onAppointmentUpdating'),
    onAppointmentDeleting: safeEvent('onAppointmentDeleting'),
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
  }, SCHEDULER_SELECTOR);
});

test('After drag over component area, shouldn\'t called onAppointment* data events and appointment shouldn\'t change position', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  await t
    .dragToElement(scheduler.getAppointment('All day test app 2').element, Selector('#space-right'));
  await t
    .expect(ClientFunction(() => (window as any).eventName)())
    .eql('')
    .expect(scheduler.getAppointment('All day test app 2').date.time)
    .eql('12:00 AM - 12:01 AM');

  await t
    .dragToElement(scheduler.getAppointment('Regular test app').element, Selector('#left-right'));
  await t
    .expect(ClientFunction(() => (window as any).eventName)())
    .eql('')
    .expect(scheduler.getAppointment('Regular test app').date.time)
    .eql('10:30 AM - 11:00 AM');
}).before(async () => {
  await safeEvent('')();
  await setStyleAttribute(Selector('#container'), 'display: flex; flex-direction: column;');

  await ClientFunction(() => {
    $('#container').append(markup);
  }, { dependencies: { markup } })();

  return createWidget('dxScheduler', {
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
    onAppointmentUpdated: safeEvent('onAppointmentUpdated'),
    onAppointmentUpdating: safeEvent('onAppointmentUpdating'),
    onAppointmentDeleting: safeEvent('onAppointmentDeleting'),
    currentDate: new Date(2021, 3, 26),
    startDayHour: 9,
    height: 600,
    width: 500,
  }, SCHEDULER_SELECTOR);
});
