import { ClientFunction } from 'testcafe';
import { getContainerFileUrl } from '../../../helpers/testHelper';

import { AppointmentWrapper } from './presets/appointment.wrapper';
import { pinkColorAppointmentList, blueColorAppointmentList } from './presets/appointment.data';
import { createScheduler, scheduler } from './presets/widget.setup';

fixture
    `Behaviour dragging between table rows in DayView-mode`.page(getContainerFileUrl());

const dragAndTest = async (t, appointmentWrapper, step) => {
    const position = appointmentWrapper.getRow(step);

    const height = appointmentWrapper.getHeight();
    const startDate = appointmentWrapper.getStartDate(step);
    const endDate = appointmentWrapper.getEndDate(step);

    const errorMessage = `incorrect for the "${appointmentWrapper.title}" at a timeline position [${position}]`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableCell(position))

        .expect(height.result).eql(await height.expect, `Height ${errorMessage}`)
        .expect(startDate.result).eql(await startDate.expect, `Start date ${errorMessage}`)
        .expect(endDate.result).eql(await endDate.expect, `End date ${errorMessage}`)
}

test('Appointments should be replaced on the timeline in DayView mode with maintaining their size and duration', async t => {
    for (let index = 0; index < pinkColorAppointmentList.length; index++) {
        const pinkColorAppointmentWrapper = await new AppointmentWrapper(pinkColorAppointmentList, index);
        const blueColorAppointmentWrapper = await new AppointmentWrapper(blueColorAppointmentList, index);

        for (let step = 0; step < pinkColorAppointmentWrapper.positionMap.length; step++) {
            await dragAndTest(t, pinkColorAppointmentWrapper, step);
            await dragAndTest(t, blueColorAppointmentWrapper, step);
        }
    }

}).before(async () => { await createScheduler('day') });
