import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';


const scheduler = new SchedulerTestHelper("#container");


fixture `Drag-and-drop appointments in the Scheduler timeline mode`
	.page(getContainerFileUrl());


test(`Drag-n-drop in the timelineDay mode from 9am to 11am`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableRowCell(0, 4));

	await t
		.expect(`140px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)
		.expect(`200px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).width)

		.expect(`11:00 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).startTime)
		.expect(`11:30 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('timelineDay', dataSource) });


test(`Drag-n-drop in the timelineWeek mode from 9am to 11am`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableRowCell(0, 4));

	await t
		.expect(`132px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)
		.expect(`200px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).width)

		.expect(`11:00 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).startTime)
		.expect(`11:30 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('timelineWeek', dataSource) });


test(`Drag-n-drop in the timelineWorkWeek mode from 9am to 11am`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableRowCell(0, 4));

	await t
		.expect(`132px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)
		.expect(`200px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).width)

		.expect(`11:00 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).startTime)
		.expect(`11:30 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('timelineWorkWeek', dataSource) });


test(`Drag-n-drop in the timelineMonth mode from Sun to Fri`, async t => {
	const draggableAppointment = await scheduler.getAppointment(`Brochure Design Review`);

	await t
		.dragToElement(draggableAppointment, scheduler.getDateTableRowCell(0, 4));

	await t
		.expect(`140px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).height)
		.expect(`200px`)
		.eql(await scheduler.getAppointmentSize(draggableAppointment).width)

		.expect(`9:00 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).startTime)
		.expect(`9:30 AM`)
		.eql(await scheduler.getAppointmenttDate(draggableAppointment).endTime);

}).before(async () => { await createScheduler('timelineMonth', dataSource) });
