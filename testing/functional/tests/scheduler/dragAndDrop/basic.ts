import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture `Drag-and-drop appointments in the Scheduler basic mode`
	.page(getContainerFileUrl());

test(`Drag-n-drop in the day mode from 9am to 11am`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableCell(4, 0));

	await t
		.expect(`50px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)

		.expect(`11:00 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).startTime)

		.expect(`11:30 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('day', dataSource) });

test(`Drag-n-drop in the week mode from 9am to 11am`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableCell(4, 0));

	await t
		.expect(`50px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)

		.expect(`11:00 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).startTime)

		.expect(`11:30 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('week', dataSource) });

test(`Drag-n-drop in the workWeek mode from 9am to 11am`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableCell(4, 0));

	await t
		.expect(`50px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)

		.expect(`11:00 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).startTime)

		.expect(`11:30 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('workWeek', dataSource) });

test(`Drag-n-drop in the month mode from Sun to Fri`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableCell(0, 4));

	await t
		.expect(`19px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)
		.expect(`200px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).width)

		.expect(`9:00 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).startTime)

		.expect(`9:30 AM`)
		.eql(await scheduler.getAppointmentDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('month', dataSource) })
