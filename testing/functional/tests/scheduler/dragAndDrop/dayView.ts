import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { AppointmentWrapper } from './lib/appointment.wrapper';
import { pinkColorAppointmentList, blueColorAppointmentList } from './lib/appointment.data';
import { createScheduler, scheduler } from './lib/widget.setup';

fixture
    `Behaviour dragging between table rows in DayView-mode`.page(getContainerFileUrl());

const appointmentDragAndDrop = async (t, appointmentWrapper, step) => {
    const timelinePosition = appointmentWrapper.getRow(step);
    const errorMessage = `incorrect for the "${appointmentWrapper.title}" at a timeline position [${timelinePosition}]`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableRow(timelinePosition))

        .expect(await appointmentWrapper.getHeightReceived()).eql(await appointmentWrapper.getHeightExpected(), `Height ${errorMessage}`)

        .expect(await appointmentWrapper.getBeginTimeReceived(step)).eql(await appointmentWrapper.getBeginTimeExpected(), `Begin time ${errorMessage}`)
        .expect(await appointmentWrapper.getFinalTimeReceived(step)).eql(await appointmentWrapper.getFinalTimeExpected(), `Final time ${errorMessage}`)
}

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let index = 0; index < pinkColorAppointmentList.length; index++) {
        const pinkColorAppointmentWrapper = await new AppointmentWrapper(pinkColorAppointmentList, index);
        const blueColorAppointmentWrapper = await new AppointmentWrapper(blueColorAppointmentList, index);

        for (let step = 0; step < pinkColorAppointmentWrapper.positionMap.length; step++) {
            await appointmentDragAndDrop(t, pinkColorAppointmentWrapper, step);
            await appointmentDragAndDrop(t, blueColorAppointmentWrapper, step);
        }
    }

}).before(async () => { await createScheduler('day') });
