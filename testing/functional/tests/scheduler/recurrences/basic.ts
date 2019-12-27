import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Rendering of the recurrence appointments in  Scheduler `
    .page(url(__dirname, '../../container.html'));

test("Drag-n-drop recurrence appointment between dateTable and allDay panel", async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Simple recurrence appointment");

    await t
        .dragToElement(draggableAppointment.element, scheduler.getAllDayTableCell(0))
        .expect(scheduler.getAppointmentCount()).eql(7)
        .expect(draggableAppointment.size.width).eql("113px")
        .expect(draggableAppointment.isAllDay).ok();

}).before(() => createScheduler({
    dataSource: dataSource,
    startDayHour: 1,
    recurrenceEditMode: "series"
}));