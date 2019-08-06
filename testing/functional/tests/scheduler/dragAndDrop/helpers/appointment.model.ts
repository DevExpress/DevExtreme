import { TablePosition, AppointmentFeature, Feature } from './appointment.helper';

import SchedulerTestHelper from '../../../../helpers/scheduler.test.helper';
export const scheduler = new SchedulerTestHelper("#container");

export class AppointmentModel {
    title: string;
    features: AppointmentFeature;

    constructor(title, appointmentFeature) {
        this.title = title;
        this.features = appointmentFeature;
    }

    async dropTo(t, to: TablePosition<number>) {
        await t
            .dragToElement(
                scheduler.getAppointmentByTitle(this.title),
                scheduler.getDateTableCell(to.row, to.cell));
    }

    async compare(t, features) {
        const element = scheduler.getAppointmentByTitle(this.title);
        const currentPosition = new TablePosition(this.features.position.row, this.features.position.cell);

        for (let feature of features) {
            switch (feature) {
                case Feature.height:
                    await t
                        .expect(this.features.size.height)
                        .eql(await scheduler.getAppointmentHeight(element),
                            this.notification('Height', currentPosition));
                    break;

                case Feature.width:
                    await t
                        .expect(this.features.size.width)
                        .eql(await scheduler.getAppointmentWidth(element),
                            this.notification('Width', currentPosition));
                    break;

                case Feature.startTime:
                    await t
                        .expect(this.features.duration.startTime)
                        .eql(await scheduler.getAppointmentStartTime(element),
                            this.notification('startTime', currentPosition));
                    break;

                case Feature.endTime:
                    await t
                        .expect(this.features.duration.endTime)
                        .eql(await scheduler.getAppointmentEndTime(element),
                            this.notification('endTime', currentPosition));
                    break;
            }
        }
    }

    notification(propertyName, position) {
        return `${propertyName} incorrect for the "${this.title}" after drag-and-drop in the row "${position.row}" and cell "${position.cell}"`
    }
}
