import { Property } from './appointment.helper';

import { TablePosition } from './props/tablePosition';
import { Size } from './props/size';
import { TimeSpan } from './props/timeSpan';

import SchedulerTestHelper from '../../../../helpers/scheduler.test.helper';

export const scheduler = new SchedulerTestHelper("#container");

export async function dropTo(t, title, position: TablePosition<number>) {
    await t.dragToElement(
        scheduler.getAppointmentByTitle(title),
        scheduler.getDateTableCell(position.row, position.cell));
}

export async function compare(t, title, properties, comparsionProperties) {
    const resultElement = await scheduler.getAppointmentByTitle(title);

    const resultSize = new Size(await scheduler.getAppointmentWidth(resultElement),
                                await scheduler.getAppointmentHeight(resultElement));

    const resultTimeSpan = new TimeSpan(await scheduler.getAppointmentStartTime(resultElement),
                                        await scheduler.getAppointmentEndTime(resultElement));

    const expectPosition = new TablePosition(properties.position.row,
                                             properties.position.cell);

    const expectSize = new Size(properties.size.width,
                                properties.size.height);

    const expectTimeSpan = new TimeSpan(properties.duration.startTime,
                                        properties.duration.endTime);

    for (let comparsionProperty of comparsionProperties) {
        switch (comparsionProperty) {
            case Property.height:
                await t
                  .expect(expectSize.height)
                  .eql(resultSize.height,
                      notification('Height', title, expectPosition));
                break;

            case Property.width:
                await t
                  .expect(expectSize.width)
                  .eql(resultSize.width,
                        notification('Width', title, expectPosition));
                break;

            case Property.startTime:
                await t
                  .expect(expectTimeSpan.startTime)
                  .eql(resultTimeSpan.startTime,
                        notification('startTime', title, expectPosition));
                break;

            case Property.endTime:
                await t
                  .expect(expectTimeSpan.endTime)
                  .eql(resultTimeSpan.endTime,
                        notification('endTime', title, expectPosition));
                break;
        }
    }
}

export function notification(property, title, position) {
    return `${property} incorrect for the "${title}" after drop
            to row "${position.row}" and cell "${position.cell}"`
}
