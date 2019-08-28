import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';
import { pathToFileURL } from 'url';
import { join } from  'path';
import Scheduler from '../../../model/scheduler';

fixture `Drag-and-drop appointments in the Scheduler basic mode`
    .page(pathToFileURL(join(__dirname, '../../container.html')).href);

test(`Drag-n-drop in the day mode from 9am to 11am`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
		.expect(draggableAppointment.size.height).eql(`50px`)
		.expect(draggableAppointment.date.startTime).eql(`11:00 AM`)
		.expect(draggableAppointment.date.endTime).eql(`11:30 AM`);
}).before(() => createScheduler('day', dataSource));

test(`Drag-n-drop in the week mode from 9am to 11am`, async t => {
    const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
		.expect(draggableAppointment.size.height).eql(`50px`)
		.expect(draggableAppointment.date.startTime).eql(`11:00 AM`)
		.expect(draggableAppointment.date.endTime).eql(`11:30 AM`);

}).before(() => createScheduler('week', dataSource));

test(`Drag-n-drop in the workWeek mode from 9am to 11am`, async t => {
	const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(4, 0))
		.expect(draggableAppointment.size.height).eql(`50px`)
		.expect(draggableAppointment.date.startTime).eql(`11:00 AM`)
        .expect(draggableAppointment.date.endTime).eql(`11:30 AM`);

}).before(() => createScheduler('workWeek', dataSource));

test(`Drag-n-drop in the month mode from Sun to Fri`, async t => {
	const scheduler = new Scheduler("#container");
    const draggableAppointment = scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment.element, scheduler.getDateTableCell(0, 4))
        .expect(draggableAppointment.size.height).eql(`19px`)
        .expect(draggableAppointment.date.startTime).eql(`9:00 AM`)
		.expect(draggableAppointment.date.endTime).eql(`9:30 AM`);

}).before(() => createScheduler('month', dataSource));
