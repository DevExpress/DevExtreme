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
    let compactAppointment = scheduler.getAppointmentCollector('1');

    await t.
        click(compactAppointment.element).debug();

    let tooltipItem = scheduler.appointmentTooltip.getListItem('Recurrence');

    await t.debug().
        drag(tooltipItem.element, -100, 0);
        
    const dialog = scheduler.getDialog();
    
    await t
        .click(dialog.appointment);

    const resizableAppointment = scheduler.getAppointment('Recurrence two', 2);

    await t
        .expect(resizableAppointment.date.startTime).eql(`7:00 AM`)
        .expect(resizableAppointment.date.endTime).eql(`10:00 AM`);
}).before(() => createScheduler({
    views: ["week"],
    currentView: "week",
    firstDayOfWeek: 2,
    startDayHour: 4,
    maxAppointmentsPerCell: 2,
    dataSource: [{
    text: "Recurrence one",
    startDate: new Date(2019, 2, 30, 8, 0),
    endDate: new Date(2019, 2, 30, 10, 0),
    recurrenceException: "",
    recurrenceRule: "FREQ=DAILY"
    }, {
    text: "Non-recurrent appointment",
    startDate: new Date(2019, 2, 30, 7, 0),
    endDate: new Date(2019, 2, 30, 11, 0),
    }, {
    text: "Recurrence two",
    startDate: new Date(2019, 2, 30, 8, 0),
    endDate: new Date(2019, 2, 30, 10, 0),
    recurrenceException: "",
    recurrenceRule: "FREQ=DAILY"
    }],
    currentDate: new Date(2019, 2, 30), 
}));
