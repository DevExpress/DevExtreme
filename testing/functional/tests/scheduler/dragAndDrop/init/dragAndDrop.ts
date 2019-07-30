
import { scheduler } from './widget.setup';
import { AppointmentWrapper } from './appointment.wrapper';

export const dragAndDropTest = async (t, appointmentId, title, rowId, cellId = 0) => {
    const appointmentWrapper = await new AppointmentWrapper(appointmentId, title, rowId);

    const width = await appointmentWrapper.getWidth();
    const height = await appointmentWrapper.getHeight();
    const startDate = await appointmentWrapper.getStartDate();
    const endDate = await appointmentWrapper.getEndDate();

    const errorMessage = `incorrect for the "${title}" at timeline position in the row "${rowId}" and cell "${cellId}"`;

    await t
        .dragToElement(appointmentWrapper.element, await scheduler.getDateTableCell(rowId, cellId))

        // .expect(width.expect).eql(await width.result, `Width ${errorMessage}`)
        .expect(height.expect).eql(await height.result, `Height ${errorMessage}`)
        .expect(startDate.expect).eql(await startDate.result, `Start date ${errorMessage}`)
        .expect(endDate.expect).eql(await endDate.result, `End date ${errorMessage}`)
}
