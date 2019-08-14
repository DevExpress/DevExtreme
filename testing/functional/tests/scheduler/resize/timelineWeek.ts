import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Resize appointments in the Scheduler widget with drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Resize appointments in timelineWeek view', async t => {
	const halfHourCellWidth = 200;
	const oneHourCellWidth = 2 * halfHourCellWidth;

	const firstAppointmentToRightIncrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToRightIncreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToRightIncrease);

	await t
		.drag(firstAppointmentToRightIncreaseHandle.right, oneHourCellWidth, 0);

	await t
		.expect('600px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToRightIncrease).width,
			"Appointment width is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToRightIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToRightIncrease).endTime,
			"Appointment endTime is incorrect after resize");

	const firstAppointmentToLeftIncrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToLeftIncreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToLeftIncrease);

	await t
		.drag(firstAppointmentToLeftIncreaseHandle.left, -oneHourCellWidth, 0);

	await t
		.expect('1000px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToLeftIncrease).width,
			"Appointment width is incorrect after resize")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('11:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).endTime,
			"Appointment endTime is incorrect after resize");

	const thirdAppointmentToRightDecrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const thirdAppointmentToRightDecreaseHandle = await scheduler.getAppointmentResizableHandle(thirdAppointmentToRightDecrease);

	await t
		.drag(thirdAppointmentToRightDecreaseHandle.right, -oneHourCellWidth, 0);

	await t
		.expect('600px')
		.eql(await scheduler.getAppointmentSize(thirdAppointmentToRightDecrease).width,
			"Appointment width is incorrect after resize")
		.expect('9:00 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToRightDecrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToRightDecrease).endTime,
			"Appointment endTime is incorrect after resize");

	const thirdAppointmentToLeftDecrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const thirdAppointmentToLeftDecreaseHandle = await scheduler.getAppointmentResizableHandle(thirdAppointmentToLeftDecrease);

	await t
		.drag(thirdAppointmentToLeftDecreaseHandle.left, oneHourCellWidth, 0);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(thirdAppointmentToLeftDecrease).width,
			"Appointment width is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToLeftDecrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(thirdAppointmentToLeftDecrease).endTime,
			"Appointment endTime is incorrect after resize");

}).before(async () => { await createScheduler('timelineWeek', dataSource) });
