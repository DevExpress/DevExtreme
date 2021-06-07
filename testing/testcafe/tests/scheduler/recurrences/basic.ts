import dataSource from './init/widget.data';
import createScheduler from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import { compareScreenshot } from '../../../helpers/screenshot-comparer';

fixture`Rendering of the recurrence appointments in  Scheduler `
  .page(url(__dirname, '../../container.html'));

test('Drag-n-drop recurrence appointment between dateTable and allDay panel', async (t) => {
  const scheduler = new Scheduler('#container');
  const draggableAppointment = scheduler.getAppointment('Simple recurrence appointment');

  await t.expect(await compareScreenshot(t, 'basic-recurrence-appointment-init.png')).ok();

  await t
    .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(0), {
      speed: 0.1,
    })
    .expect(scheduler.getAppointmentCount()).eql(7)
    .expect(draggableAppointment.size.width)
    .eql('114px')
    .expect(draggableAppointment.isAllDay)
    .ok();

  await t.expect(await compareScreenshot(t, 'basic-recurrence-appointment-after-drag.png')).ok();
}).before(async () => createScheduler({
  dataSource,
  startDayHour: 1,
  recurrenceEditMode: 'series',
}));
