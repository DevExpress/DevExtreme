import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';


fixture `Resize appointments in the Scheduler basic mode`
	.page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");

const oneDayCellWidth = 200;
const oneHourCellHeight = 100;
const oneHourCellWidth = 200;

test(`Resize in the day mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.bottom, 0, oneHourCellHeight);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.top, 0, oneHourCellHeight);

	await t
		.expect('100px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.top, 0, -oneHourCellHeight);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

		await t
			.drag(resizableAppointmentHandle.bottom, 0, -oneHourCellHeight);

	await t
		.expect('100px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('day', dataSource) });

test(`Resize in the week mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.bottom, 0, oneHourCellHeight);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.top, 0, oneHourCellHeight);

	await t
		.expect('100px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.top, 0, -oneHourCellHeight);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

		await t
			.drag(resizableAppointmentHandle.bottom, 0, -oneHourCellHeight);

	await t
		.expect('100px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('week', dataSource) });

test(`Resize in the workWeek mode`, async t => {
	const resizableAppointment = await scheduler.getAppointment('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t
		.drag(resizableAppointmentHandle.bottom, 0, oneHourCellHeight);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.top, 0, oneHourCellHeight);

	await t
		.expect('100px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

	await t
		.drag(resizableAppointmentHandle.top, 0, -oneHourCellHeight);

	await t
		.expect('200px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('12:00 PM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

		await t
			.drag(resizableAppointmentHandle.bottom, 0, -oneHourCellHeight);

	await t
		.expect('100px')
		.eql(await scheduler.getAppointmentSize(resizableAppointment).height)

		.expect('10:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).startTime)

		.expect('11:00 AM')
		.eql(await scheduler.getAppointmentDate(resizableAppointment).endTime);

}).before(async () => { await createScheduler('workWeek', dataSource) });

test(`Resize in the month mode`, async t => {
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

}).before(async () => { await createScheduler('month', dataSource) });
