import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Resize appointments in the Scheduler widget with drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Resize appointments in week', async t => {
	let appointment;
	let appointmentHandleTop;
	let appointmentHandleBottom;

	appointment = await scheduler.getAppointmentByTitle('Brochure Design Review');
	appointmentHandleTop = await scheduler.getAppointmentResizableHandleTop(appointment);
	appointmentHandleBottom = await scheduler.getAppointmentResizableHandleBottom(appointment);

	await t
		.drag(appointmentHandleBottom, 0, 100)

	await t
		.expect('150px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.drag(appointmentHandleTop, 0, -100)

	await t
		.expect('250px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	await t
		.drag(appointmentHandleBottom, 0, -200)

	await t
		.expect('50px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");

	appointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	appointmentHandleTop = await scheduler.getAppointmentResizableHandleTop(appointment);
	appointmentHandleBottom = await scheduler.getAppointmentResizableHandleBottom(appointment);

	await t
		.drag(appointmentHandleTop, 0, 200)

	await t
		.expect('50px')
		.eql(await scheduler.getAppointmentHeight(appointment),
			"Appointment height incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentStartTime(appointment),
			"Appointment startTime incorrect")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentEndTime(appointment),
			"Appointment endTime incorrect");


}).before(async () => { await createScheduler('week', dataSource) });
