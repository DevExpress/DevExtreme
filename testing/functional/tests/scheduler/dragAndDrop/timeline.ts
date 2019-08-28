import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import { pathToFileURL } from 'url';
import { join } from  'path';
import Scheduler from '../../../model/scheduler';

fixture `Drag-and-drop appointments in the Scheduler timeline mode`
    .page(pathToFileURL(join(__dirname, '../../container.html')).href);

test(`Drag-n-drop in the timelineDay mode from 9am to 11am`, async t => {
	const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
		.expect(draggableAppointment.size.height).eql(`140px`)
		.expect(draggableAppointment.size.width).eql(`200px`)
        .expect(draggableAppointment.date.startTime).eql(`11:00 AM`)
        .expect(draggableAppointment.date.endTime).eql(`11:30 AM`);

}).before(() => createScheduler('timelineDay', dataSource));

test(`Drag-n-drop in the timelineWeek mode from 9am to 11am`, async t => {
	const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
		.expect(draggableAppointment.size.height).eql(`132px`)
		.expect(draggableAppointment.size.width).eql(`200px`)
        .expect(draggableAppointment.date.startTime).eql(`11:00 AM`)
        .expect(draggableAppointment.date.endTime).eql(`11:30 AM`);

}).before(async () => { await createScheduler('timelineWeek', dataSource) });


test(`Drag-n-drop in the timelineWorkWeek mode from 9am to 11am`, async t => {
	const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
        .dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.height).eql(`132px`)
		.expect(draggableAppointment.size.width).eql(`200px`)
        .expect(draggableAppointment.date.startTime).eql(`11:00 AM`)
        .expect(draggableAppointment.date.endTime).eql(`11:30 AM`);

}).before(() => createScheduler('timelineWorkWeek', dataSource));

test(`Drag-n-drop in the timelineMonth mode from Sun to Fri`, async t => {
	const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.height).eql(`140px`)
		.expect(draggableAppointment.size.width).eql(`200px`)
        .expect(draggableAppointment.date.startTime).eql(`9:00 AM`)
        .expect(draggableAppointment.date.endTime).eql(`9:30 AM`);

}).before(() => createScheduler('timelineMonth', dataSource));
