import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture `Drag-and-drop appointments in the Scheduler timeline views`
    .page(url(__dirname, '../../container.html'));

["timelineDay", "timelineWeek", "timelineWorkWeek"].forEach(view => test(`Drag-n-drop in the "${view}" view`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Brochure Design Review");

    await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.width).eql("200px")
        .expect(draggableAppointment.date.time).eql("11:00 AM - 11:30 AM");

}).before(() => createScheduler({
    views: [view],
    currentView: view,
    dataSource: dataSource
})));

test(`Drag-n-drop in the "timelineMonth" view`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Brochure Design Review");

    await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.height).eql("140px")
        .expect(draggableAppointment.size.width).eql("200px")
        .expect(draggableAppointment.date.time).eql("9:00 AM - 9:30 AM")

}).before(() => createScheduler({
    views: ["timelineMonth"],
    currentView: "timelineMonth",
    dataSource: dataSource
}));

test(`Drag appointment through timezone change`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment("Staff Productivity Report");

    await t
        .debug()
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 2))
        .debug()
        .expect(draggableAppointment.date.time).eql("12:00 AM - 12:00 AM")
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.date.time).eql("12:00 AM - 12:00 AM");

}).before(() => createScheduler({
    dataSource: [{
        "text": "Staff Productivity Report",
        startDate: '2019-11-04T00:00',
        endDate: '2019-11-06T00:00',
    }],
    maxAppointmentsPerCell: 'unlimited',
    views: ["timelineMonth"],
    currentView: "timelineMonth",
    currentDate: new Date(2019, 10, 1),
    height: 300,
    startDayHour: 0,
}));
