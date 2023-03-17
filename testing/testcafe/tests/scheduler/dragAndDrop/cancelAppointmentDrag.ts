import { ClientFunction } from 'testcafe';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Cancel appointment Drag-and-Drop`
  .page(url(__dirname, '../../container.html'));

const APPOINTMENT_DRAG_SOURCE_CLASS = '.dx-scheduler-appointment-drag-source';

const disableMouseUpEvent = ClientFunction(() => {
  const proto = (window as any)['%testCafeAutomation%'].DragToElement.prototype.constructor.prototype;

  // eslint-disable-next-line spellcheck/spell-checker,no-underscore-dangle
  (window as any)._originalMouseup = proto._mouseup;

  // eslint-disable-next-line max-len
  // eslint-disable-next-line spellcheck/spell-checker,no-underscore-dangle, no-promise-executor-return
  proto._mouseup = () => new Promise((r) => setTimeout(r, 1));
});

const enableMouseUpEvent = ClientFunction(() => {
  // eslint-disable-next-line no-underscore-dangle,spellcheck/spell-checker
  (window as any)['%testCafeAutomation%'].DragToElement.prototype.constructor.prototype._mouseup = (window as any)._originalMouseup;
});

test('on escape - date should not changed when it\'s pressed during dragging (T832754)', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Appointment');
  await disableMouseUpEvent();

  await t
    .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
    .pressKey('esc');

  await enableMouseUpEvent();

  await t
    .expect(scheduler.element.find(APPOINTMENT_DRAG_SOURCE_CLASS).exists)
    .notOk()
    .expect(draggableAppointment.date.time)
    .eql('10:00 AM - 10:30 AM');
}).before(async () => createScheduler({
  _draggingMode: 'default',
  height: 600,
  views: ['day'],
  currentView: 'day',
  cellDuration: 30,
  dataSource: [{
    text: 'Appointment',
    startDate: new Date(2020, 9, 14, 10, 0),
    endDate: new Date(2020, 9, 14, 10, 30),
  }],
  currentDate: new Date(2020, 9, 14),
  showAllDayPanel: false,
}));
