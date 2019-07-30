
import { scheduler } from './widget.setup';
import { AppointmentWrapper } from './appointment.wrapper';

export const dragAndDropTest = async (t, appointmentId, title, rowId, cellId = 0) => {
    const appointmentWrapper = await new AppointmentWrapper(appointmentId, title, rowId);

    const height = appointmentWrapper.getHeight();
    const startDate = appointmentWrapper.getStartDate();
    const endDate = appointmentWrapper.getEndDate();

    const errorMessage = `incorrect for the "${title}" at a timeline position ${rowId}:${cellId}`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableCell(rowId, cellId))

        .expect(height.result).eql(await height.expect, `Height ${errorMessage}`)
        .expect(startDate.result).eql(await startDate.expect, `Start date ${errorMessage}`)
        .expect(endDate.result).eql(await endDate.expect, `End date ${errorMessage}`)
}
