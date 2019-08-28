import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';


fixture `Resize appointments in the Scheduler basic mode`
	.page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");

const oneDayCellWidth = 200;
const oneHourCellWidth = 400;

test(`Resize in the timelineDay mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.right, oneHourCellWidth, 0);

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, oneHourCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, -oneHourCellWidth, 0);

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.right, -oneHourCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('timelineDay', dataSource) });

test(`Resize in the timelineWeek mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.right, oneHourCellWidth, 0);

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, oneHourCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, -oneHourCellWidth, 0);

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.right, -oneHourCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('timelineWeek', dataSource) });

test(`Resize in the timelineWorkWeek mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.right, oneHourCellWidth, 0);

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, oneHourCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, -oneHourCellWidth, 0);

	await t
		.expect('800px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.right, -oneHourCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('timelineWorkWeek', dataSource) });

test(`Resize in the timelineMonth mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.right, oneDayCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, oneDayCellWidth, 0);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.left, -oneDayCellWidth, 0);

	await t
		.expect('400px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.right, -oneDayCellWidth, 0);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).width)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('timelineMonth', dataSource) });
