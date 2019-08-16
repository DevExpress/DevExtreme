import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { dataSource } from './init/widget.data';
import { createScheduler } from './init/widget.setup';

import SchedulerTestHelper from '../../../helpers/scheduler.test.helper';

const scheduler = new SchedulerTestHelper("#container");

fixture`Rearrange appointments in the Scheduler widget with the drag-and-drop gesture`
    .page(getContainerFileUrl());

test('Drag-and-drop appointments in timelineMonth', async t => {
    let appointment;

    appointment = await scheduler.getAppointmentElementByTitle('Brochure Design Review');

    await t
        .dragToElement(appointment, scheduler.getDateTableCellElement(0, 3))

        .expect('200px')
		.eql(await scheduler.getAppointmentElementSize(appointment).width,
			"Appointment width incorrect")
        .expect('140px')
		.eql(await scheduler.getAppointmentElementSize(appointment).height,
			"Appointment height incorrect")
        .expect('9:00 AM')
		.eql(await scheduler.getAppointmentElementTime(appointment).startTime,
			"Appointment startTime incorrect")
        .expect('9:30 AM')
		.eql(await scheduler.getAppointmentElementTime(appointment).endTime,
			"Appointment endTime incorrect");

    appointment = await scheduler.getAppointmentElementByTitle('Update NDA Agreement');

    await t
        .dragToElement(appointment, scheduler.getDateTableCellElement(0, 3))

        .expect('200px')
		.eql(await scheduler.getAppointmentElementSize(appointment).width,
			"Appointment width incorrect")
        .expect('140px')
		.eql(await scheduler.getAppointmentElementSize(appointment).height,
			"Appointment height incorrect")
        .expect('9:00 AM')
		.eql(await scheduler.getAppointmentElementTime(appointment).startTime,
			"Appointment startTime incorrect")
        .expect('10:00 AM')
		.eql(await scheduler.getAppointmentElementTime(appointment).endTime,
			"Appointment endTime incorrect");

    appointment = await scheduler.getAppointmentElementByTitle('Staff Productivity Report');

    await t
        .dragToElement(appointment, scheduler.getDateTableCellElement(0, 3))

        .expect('200px')
		.eql(await scheduler.getAppointmentElementSize(appointment).width,
			"Appointment width incorrect")
        .expect('140px')
		.eql(await scheduler.getAppointmentElementSize(appointment).height,
			"Appointment height incorrect")
        .expect('9:00 AM')
		.eql(await scheduler.getAppointmentElementTime(appointment).startTime,
			"Appointment startTime incorrect")
        .expect('10:30 AM')
		.eql(await scheduler.getAppointmentElementTime(appointment).endTime,
			"Appointment endTime incorrect");

}).before(async () => { await createScheduler('timelineMonth', dataSource) });
