import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { AppointmentWrapper } from './lib/appointment.wrapper';
import { pinkColorAppointmentList, blueColorAppointmentList } from './lib/appointment.data';
import { createScheduler, scheduler } from './lib/widget.setup';

fixture
    `Behaviour dragging between table rows in DayView-mode`.page(getContainerFileUrl());

const dragAndDropAppointment = async (t, appointmentWrapper, position) => {
    const rowIndex = appointmentWrapper.getRow(position);
    const message = `incorrect for the "${appointmentWrapper.title}"" at a timeline position ${rowIndex}`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableRow(rowIndex))

        .expect(await appointmentWrapper.getHeightReceived()).eql(await appointmentWrapper.getHeightExpected(), `Height ${message}`)

        .expect(await appointmentWrapper.getBeginTimeReceived(position)).eql(await appointmentWrapper.getBeginTimeExpected(), `Begin time ${message}`)
        .expect(await appointmentWrapper.getFinalTimeReceived(position)).eql(await appointmentWrapper.getFinalTimeExpected(), `Final time ${message}`);

}

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let index = 0; index < pinkColorAppointmentList.length; index++) {
        const pinkColorAppointmentWrapper = await new AppointmentWrapper(pinkColorAppointmentList, index);
        const blueColorAppointmentWrapper = await new AppointmentWrapper(blueColorAppointmentList, index);

        for (let position = 0; position < pinkColorAppointmentWrapper.positionMap.length; position++) {
            await dragAndDropAppointment(t, pinkColorAppointmentWrapper, position);
            await dragAndDropAppointment(t, blueColorAppointmentWrapper, position);
        }
    }

}).before(async () => { await createScheduler('day') });
