import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { AppointmentWrapper } from './lib/appointment.wrapper';
import { pinkAppointments, blueAppointments } from './lib/appointment.data';
import { createScheduler, scheduler } from './lib/widget.setup';

fixture
    `Behaviour dragging between table rows in DayView-mode`.page(getContainerFileUrl());

const dragAndDropAppointment = async (t, appointmentWrapper, movementIndex) => {
    const rowIndex = appointmentWrapper.getRow(movementIndex);
    const message = ` incorrect for [${appointmentWrapper.title}] at row ${rowIndex}`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableRow(rowIndex))

        .expect(await appointmentWrapper.height.getReceived).eql(await appointmentWrapper.height.getExpected, `Height ${message}`)

        .expect(await appointmentWrapper.startTime.getReceived(movementIndex)).eql(await appointmentWrapper.startTime.getExpected(), `Start time ${message}`)
        .expect(await appointmentWrapper.finalTime.getReceived(movementIndex)).eql(await appointmentWrapper.finalTime.getExpected(), `Final time ${message}`);

}

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let index = 0; index < pinkAppointments.length; index++) {
        const pinkColorItem = await new AppointmentWrapper(pinkAppointments, index);
        const blueColorItem = await new AppointmentWrapper(blueAppointments, index);

        for (let movementIndex = 0; movementIndex < pinkColorItem.movementMap.length; movementIndex++) {
            await dragAndDropAppointment(t, pinkColorItem, movementIndex);
            await dragAndDropAppointment(t, blueColorItem, movementIndex);
        }
    }

}).before(async () => { await createScheduler('day') });
