import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Resize appointments in the Scheduler widget with drag-and-drop gesture`
	.page(getContainerFileUrl());

test('Resize appointments in month view', async t => {
	const oneDayCellWidth = 200;

	const firstAppointmentToRightIncrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToRightIncreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToRightIncrease);

	await t
		.drag(firstAppointmentToRightIncreaseHandle.right, 4 * oneDayCellWidth, 0);

	await t
		.expect('1000px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToRightIncrease).width,
			"Appointment width is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToRightIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToRightIncrease).endTime,
			"Appointment endTime is incorrect after resize");

	const firstAppointmentToLeftIncrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToLeftIncreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToLeftIncrease);

	await t
		.drag(firstAppointmentToLeftIncreaseHandle.left, 3 * oneDayCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToLeftIncrease).width,
			"Appointment width is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).endTime,
			"Appointment endTime is incorrect after resize");

	const firstAppointmentToLeftDecrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToLeftDecreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToLeftDecrease);

	await t
		.drag(firstAppointmentToLeftDecreaseHandle.left, -3 * oneDayCellWidth, 0);

	await t
		.expect('1000px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToLeftIncrease).width,
			"Appointment width is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).endTime,
			"Appointment endTime is incorrect after resize");


	const firstAppointmentToRightDecrease = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const firstAppointmentToRightDecreaseHandle = await scheduler.getAppointmentResizableHandle(firstAppointmentToRightDecrease);

	await t
		.drag(firstAppointmentToRightDecreaseHandle.right, -4 * oneDayCellWidth, 0);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(firstAppointmentToRightDecrease).width,
			"Appointment width is incorrect after resize")
		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).startTime,
			"Appointment startTime is incorrect after resize")
		.expect('10:30 AM')
		.eql(await scheduler.getAppointmentTime(firstAppointmentToLeftIncrease).endTime,
			"Appointment endTime is incorrect after resize");

}).before(async () => { await createScheduler('month', dataSource) });
