import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Resize appointments in the Scheduler widget with drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Resize appointments in week view', async t => {
	const halfHourCellHeight = 50;
	const oneHourCellHeight = 2 * halfHourCellHeight;

	const firstAppointmentToBottomIncrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToBottomIncreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToBottomIncrease);

	await t
		.drag(firstAppointmentToBottomIncreaseHandle.bottom, 0, oneHourCellHeight);

	await t
		.expect('150px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToBottomIncrease).height,
			"Appointment height is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToBottomIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToBottomIncrease).endTime,
			"Appointment endTime is incorrect after resize");

	const firstAppointmentToTopIncrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToTopIncreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToTopIncrease);

	await t
		.drag(firstAppointmentToTopIncreaseHandle.top, 0, -oneHourCellHeight);

	await t
		.expect('250px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToTopIncrease).height,
			"Appointment height is incorrect after resize")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToTopIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToTopIncrease).endTime,
			"Appointment endTime is incorrect after resize");

	const thirdAppointmentToBottomDecrease = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	const thirdAppointmentToBottomDecreaseHandle = await scheduler.getAppointmentResizableHandle(thirdAppointmentToBottomDecrease);

	await t
		.drag(thirdAppointmentToBottomDecreaseHandle.bottom, 0, -oneHourCellHeight);

	await t
		.expect('150px')
		.eql(await scheduler.getAppointmentSize(thirdAppointmentToBottomDecrease).height,
			"Appointment height is incorrect after resize")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToBottomDecrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToBottomDecrease).endTime,
			"Appointment endTime is incorrect after resize");

	const thirdAppointmentToTopDecrease = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	const thirdAppointmentToTopDecreaseHandle = await scheduler.getAppointmentResizableHandle(thirdAppointmentToTopDecrease);

	await t
		.drag(thirdAppointmentToTopDecreaseHandle.top, 0, oneHourCellHeight);

	await t
		.expect('50px')
		.eql(await scheduler.getAppointmentSize(thirdAppointmentToTopDecrease).height,
			"Appointment height is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToTopDecrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToTopDecrease).endTime,
			"Appointment endTime is incorrect after resize");

}).before(async () => { await createScheduler('week', dataSource) });
