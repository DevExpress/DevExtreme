import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`
    .page(getContainerFileUrl());

test('Drag-and-drop appointments in week', async t => {

    const firstAppointment = await scheduler.getAppointmentByTitle('Brochure Design Review');

	await t
		.dragToElement(firstAppointment, scheduler.getDateTableCell(1, 0))

		.expect('50px')
		.eql(await scheduler.getAppointmentSize(firstAppointment).height,
			"Appointment height incorrect")
		.expect('9:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointment).startTime,
			"Appointment startTime incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointment).endTime,
			"Appointment endTime incorrect");

	const secondAppointment = await scheduler.getAppointmentByTitle('Update NDA Agreement');

	await t
		.dragToElement(secondAppointment, scheduler.getDateTableCell(2, 0))

		.expect('100px')
		.eql(await scheduler.getAppointmentSize(secondAppointment).height,
			"Appointment height incorrect")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(secondAppointment).startTime,
			"Appointment startTime incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentTime(secondAppointment).endTime,
			"Appointment endTime incorrect");

	const thirdAppointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');

	await t
		.dragToElement(thirdAppointment, scheduler.getDateTableCell(4, 0))

		.expect('150px')
		.eql(await scheduler.getAppointmentSize(thirdAppointment).height,
			"Appointment height incorrect")
		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointment).startTime,
			"Appointment startTime incorrect")
		.expect('12:30 PM')
		.eql(await scheduler.getAppointmentTime(thirdAppointment).endTime,
			"Appointment endTime incorrect");

}).before(async () => { await createScheduler('week', dataSource) });
