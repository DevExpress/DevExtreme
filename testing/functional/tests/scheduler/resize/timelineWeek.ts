import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Resize appointments in the Scheduler widget with drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Resize appointments in timelineWeek', async t => {
	let appointment;
	let appointmentHandleLeft;
	let appointmentHandleRight;

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');
	appointmentHandleLeft = await scheduler.getAppointmentResizableHandleLeft(appointment);
	appointmentHandleRight = await scheduler.getAppointmentResizableHandleRight(appointment);

	await t
		.drag(appointmentHandleRight, 400, 0)

	await t
		.expect('600px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.drag(appointmentHandleLeft, -400, 0)

	await t
		.expect('1000px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.drag(appointmentHandleRight, -800, 0)

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	appointmentHandleLeft = await scheduler.getAppointmentResizableHandleLeft(appointment);
	appointmentHandleRight = await scheduler.getAppointmentResizableHandleRight(appointment);

	await t
		.drag(appointmentHandleLeft, 800, 0)

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentWidth(appointment),
			"Appointment width incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");


}).before(async () => { await createScheduler('timelineWeek', dataSource) });
