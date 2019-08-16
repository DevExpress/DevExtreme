import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';


fixture`Resize appointments in day view mode with the drag-and-drop gesture`
	.page(getContainerFileUrl());

const scheduler = new SchedulerTestHelper("#container");

const halfHourCellHeight = 50;
const oneHourCellHeight = 2 * halfHourCellHeight;


test('Increase an appointment with resizing handle on the bottom', async t => {
	const resizableAppointment = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t.drag(resizableAppointmentHandle.bottom, 0, oneHourCellHeight);

	const resizableAppointmentSize = await scheduler.getAppointmentSize(resizableAppointment);
	const resizableAppointmentTime = await scheduler.getAppointmentTime(resizableAppointment);

	await t.expect('150px').eql(await resizableAppointmentSize.height)

		   .expect('10:00 AM').eql(await resizableAppointmentTime.startTime)
		   .expect('11:30 AM').eql(await resizableAppointmentTime.endTime);

}).before(async () => { await createScheduler('day', dataSource) });


test('Increase an appointment with resizing handle on the top', async t => {
	const resizableAppointment = await scheduler.getAppointmentByTitle('Brochure Design Review');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t.drag(resizableAppointmentHandle.top, 0, -oneHourCellHeight);

	const resizableAppointmentSize = await scheduler.getAppointmentSize(resizableAppointment);
	const resizableAppointmentTime = await scheduler.getAppointmentTime(resizableAppointment);

	await t.expect('150px').eql(await resizableAppointmentSize.height)

		   .expect('9:00 AM').eql(await resizableAppointmentTime.startTime)
		   .expect('10:30 AM').eql(await resizableAppointmentTime.endTime);

}).before(async () => { await createScheduler('day', dataSource) });


test('Decrease an appointment with resizing handle on the bottom', async t => {
	const resizableAppointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t.drag(resizableAppointmentHandle.bottom, 0, -oneHourCellHeight);

	const resizableAppointmentSize = await scheduler.getAppointmentSize(resizableAppointment);
	const resizableAppointmentTime = await scheduler.getAppointmentTime(resizableAppointment);

	await t.expect('150px').eql(await resizableAppointmentSize.height)

		   .expect('9:00 AM').eql(await resizableAppointmentTime.startTime)
		   .expect('10:30 AM').eql(await resizableAppointmentTime.endTime);

}).before(async () => { await createScheduler('day', dataSource) });


test('Decrease an appointment with resizing handle on the top', async t => {
	const resizableAppointment = await scheduler.getAppointmentByTitle('Staff Productivity Report');
	const resizableAppointmentHandle = await scheduler.getAppointmentResizableHandle(resizableAppointment);

	await t.drag(resizableAppointmentHandle.top, 0, oneHourCellHeight);

	const resizableAppointmentSize = await scheduler.getAppointmentSize(resizableAppointment);
	const resizableAppointmentTime = await scheduler.getAppointmentTime(resizableAppointment);

	await t.expect('150px').eql(await resizableAppointmentSize.height)

		   .expect('10:00 AM').eql(await resizableAppointmentTime.startTime)
		   .expect('11:30 AM').eql(await resizableAppointmentTime.endTime);

}).before(async () => { await createScheduler('day', dataSource) });
