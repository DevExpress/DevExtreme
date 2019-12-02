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

test(`Drag-n-drop in the 'month' view`, async t => {
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
