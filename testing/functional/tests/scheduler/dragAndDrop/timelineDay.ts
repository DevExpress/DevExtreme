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

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('200px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 3))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('200px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");


	appointment = await scheduler.getAppointmentByTitle('Update NDA Agreement');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('400px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 3))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('400px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('600px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 3))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('600px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");


	appointment = await scheduler.getAppointmentByTitle('Update NDA Agreement');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 1))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('400px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');

	await t
		.dragToElement(appointment, scheduler.getDateTableCell(0, 0))

		.expect('140px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('200px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

}).before(async () => { await createScheduler('timelineDay', dataSource) });
