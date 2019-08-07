import { TablePosition } from './props/tablePosition';
import { Size } from './props/size';
import { TimeSpan } from './props/timeSpan';

export class AppointmentModel {
    title: string;
    properties: Properties;

    constructor(title, properties) {
        this.title = title;
        this.properties = properties;
    }
}

export interface Properties {
    position: TablePosition<number>,
    size: Size<string>,
    duration: TimeSpan<string>
}

export enum Property {
    width, height, startTime, endTime
}
