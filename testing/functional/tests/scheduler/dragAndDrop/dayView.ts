import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { AppointmentWrapper } from './lib/appointment.wrapper';
import { pinkAppointments, blueAppointments } from './lib/appointment.data';
import { createScheduler, scheduler } from './lib/widget.setup';

fixture
    `Behaviour dragging between table rows in DayView-mode`.page(getContainerFileUrl());

const dragAndDropAppointment = async (t, appointmentWrapper, moveIndex) => {
    const rowIndex = appointmentWrapper.getRow(moveIndex);
    const message = ` incorrect for [${appointmentWrapper.title}] at row ${rowIndex}`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableRow(rowIndex))

        .expect(await appointmentWrapper.getHeightReceived()).eql(await appointmentWrapper.getHeightExpected(), `Height ${message}`)

        .expect(await appointmentWrapper.getBeginTimeReceived(moveIndex)).eql(await appointmentWrapper.getBeginTimeExpected(), `Start time ${message}`)
        .expect(await appointmentWrapper.getFinalTimeReceived(moveIndex)).eql(await appointmentWrapper.getFinalTimeExpected(), `Final time ${message}`);

}

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let index = 0; index < pinkAppointments.length; index++) {
        const pinkColorItem = await new AppointmentWrapper(pinkAppointments, index);
        const blueColorItem = await new AppointmentWrapper(blueAppointments, index);

        for (let moveIndex = 0; moveIndex < pinkColorItem.moveMap.length; moveIndex++) {
            await dragAndDropAppointment(t, pinkColorItem, moveIndex);
            await dragAndDropAppointment(t, blueColorItem, moveIndex);
        }
    }

}).before(async () => { await createScheduler('day') });
