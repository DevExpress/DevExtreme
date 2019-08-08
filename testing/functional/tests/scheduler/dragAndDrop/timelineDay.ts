import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Drag-and-drop appointments in timelineDay', async t => {
	let appointment;

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('200px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('9:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('10:00 AM').eql(await scheduler.getAppointmentEndTime(appointment));

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 3))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('200px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('10:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('11:00 AM').eql(await scheduler.getAppointmentEndTime(appointment));


	appointment = await scheduler.getAppointmentByTitle('Update NDA Agreement');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('400px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('9:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('10:30 AM').eql(await scheduler.getAppointmentEndTime(appointment));

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 3))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('400px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('10:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('11:30 AM').eql(await scheduler.getAppointmentEndTime(appointment));

	appointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('600px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('9:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('11:00 AM').eql(await scheduler.getAppointmentEndTime(appointment));

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 3))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('600px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('10:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('12:00 PM').eql(await scheduler.getAppointmentEndTime(appointment));


	appointment = await scheduler.getAppointmentByTitle('Update NDA Agreement');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('400px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('9:30 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('10:30 AM').eql(await scheduler.getAppointmentEndTime(appointment));

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 0))

		.expect('140px').eql(await scheduler.getAppointmentHeight(appointment))
		.expect('200px').eql(await scheduler.getAppointmentWidth(appointment))
		.expect('9:00 AM').eql(await scheduler.getAppointmentStartTime(appointment))
		.expect('9:30 AM').eql(await scheduler.getAppointmentEndTime(appointment));

}).before(async () => { await createScheduler('timelineDay', dataSource) });
