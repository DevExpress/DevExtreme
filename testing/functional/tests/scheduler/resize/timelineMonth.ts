import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Resize appointments in the Scheduler widget with drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Resize appointments in timelineMonth', async t => {
	let appointment;
	let appointmentHandleLeft;
	let appointmentHandleRight;

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');
	appointmentHandleLeft = await scheduler.getAppointmentResizableHandleLeft(appointment);
	appointmentHandleRight = await scheduler.getAppointmentResizableHandleRight(appointment);

	await t
		.drag(appointmentHandleRight, 1000, 0)

	await t
		.expect('1200px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.drag(appointmentHandleLeft, 800, 0)

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Update NDA Agreement');
	appointmentHandleLeft = await scheduler.getAppointmentResizableHandleLeft(appointment);
	appointmentHandleRight = await scheduler.getAppointmentResizableHandleRight(appointment);

	await t
		.drag(appointmentHandleRight, 600, 0)

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	appointmentHandleLeft = await scheduler.getAppointmentResizableHandleLeft(appointment);
	appointmentHandleRight = await scheduler.getAppointmentResizableHandleRight(appointment);

	await t
		.drag(appointmentHandleRight, 200, 0)

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');
	appointmentHandleLeft = await scheduler.getAppointmentResizableHandleLeft(appointment);
	appointmentHandleRight = await scheduler.getAppointmentResizableHandleRight(appointment);

	await t
		.drag(appointmentHandleLeft, -400, 0)

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.drag(appointmentHandleRight, -400, 0)

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

}).before(async () => { await createScheduler('timelineMonth', dataSource) });
