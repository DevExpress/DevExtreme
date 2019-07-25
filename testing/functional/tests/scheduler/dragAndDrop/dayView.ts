import { ClientFunction } from 'testcafe';

import { getContainerFileUrl } from '../../../helpers/testHelper';

import { createScheduler, scheduler } from './lib/widget.setup';
import { majorAppointments, minorAppointments } from './lib/appointment.data';
import { AppointmentWrapper } from './lib/appointment.wrapper';

fixture
    `Behaviour dragging between table rows in DayView-mode`
    .page(getContainerFileUrl());

const dragAndDropAppointment = async (t, wrapper, movementIndex) => {
    const rowIndex = wrapper.row(movementIndex);
    const message = ` incorrect for [${wrapper.title}] at row ${rowIndex}`;

    await t
        .dragToElement(wrapper.element, await scheduler.getDateTableRow(rowIndex))

        .expect(await wrapper.height.received)
        .eql(await wrapper.height.expected, `Height ${message}`)

        .expect(await wrapper.startTime.received(movementIndex))
        .eql(await wrapper.startTime.expected(), `Start time ${message}`)

        .expect(await wrapper.finalTime.received(movementIndex))
        .eql(await wrapper.finalTime.expected(), `Final time ${message}`);
}

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let index = 0; index < majorAppointments.length; index++) {
        const majorWrapper = await new AppointmentWrapper(majorAppointments, index);
        const minorWrapper = await new AppointmentWrapper(minorAppointments, index);

        for (let movementIndex = 0; movementIndex < majorWrapper.movementMap.length; movementIndex++) {
            await dragAndDropAppointment(t, majorWrapper, movementIndex);
            await dragAndDropAppointment(t, minorWrapper, movementIndex);
        }
    }
}).before(async () => { await createScheduler('day') });
