import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Drag-and-drop appointments in the Scheduler basic views`
    .page(url(__dirname, '../../container.html'));

["day", "week", "workWeek"].forEach(view => test(`Drag-n-drop in the "${view}" view`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Brochure Design Review");

    await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
        .expect(draggableAppointment.size.height).eql("50px")
        .expect(draggableAppointment.date.startTime).eql("11:00 AM")
        .expect(draggableAppointment.date.endTime).eql("11:30 AM");

}).before(() => createScheduler({
    views: [view],
    currentView: view,
    dataSource: dataSource
})));

test(`Drag-n-drop in the "month" view`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Brochure Design Review");

    await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.height).eql("19px")
        .expect(draggableAppointment.date.startTime).eql("9:00 AM")
        .expect(draggableAppointment.date.endTime).eql("9:30 AM");

}).before(() => createScheduler({
    views: ["month"],
    currentView: "month",
    dataSource: dataSource
}));

test(`Drag recurrent appointment occurrence from collector (T832887)`, async t => {
    const scheduler = new Scheduler("#container");
    const resizableAppointment = scheduler.getAppointment('Recurrence', 1);

    await t
        .drag(resizableAppointment.resizableHandle.top, 0, -100)
        .click(resizableAppointment.element)
        .expect(resizableAppointment.size.height).eql(`200px`)
        .expect(resizableAppointment.date.startTime).eql(`10:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`12:00 PM`);

}).before(() => createScheduler({
    views: ["week"],
    currentView: "week",
    firstDayOfWeek: 2,  
    dataSource: [{
      text: "Recurrence",
      startDate: new Date(2019, 2, 30, 2, 0),
      endDate: new Date(2019, 2, 30, 10, 0),
      recurrenceException: "",
      recurrenceRule: "FREQ=DAILY"
    }],
    currentDate: new Date(2019, 2, 30),
}));