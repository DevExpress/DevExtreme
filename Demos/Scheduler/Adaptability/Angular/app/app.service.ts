import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    recurrenceRule?: string;
    allDay?: boolean;
    priorityId?: number[];
}

export class Resource {
    text: string;
    id: number;
    color?: string;
}

let appointments: Appointment[] = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date("2021-04-26T06:30:00.000Z"),
        endDate: new Date("2021-04-26T08:30:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,FR;WKST=TU;INTERVAL=2;COUNT=32",
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date("2021-04-26T06:30:00.000Z"),
        endDate: new Date("2021-04-26T08:30:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,FR;INTERVAL=4;COUNT=32",
        allDay: true,
        priorityId: [1]
    }, {
        text: "Install New Router in Dev Room",
        startDate: new Date("2021-04-26T06:30:00.000Z"),
        endDate: new Date("2021-04-26T08:30:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=FR;INTERVAL=2;COUNT=32"
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-05-05T07:00:00.000Z"),
        endDate: new Date("2021-05-05T08:00:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=WE;INTERVAL=2;COUNT=32",
        priorityId: [2]
    }, {
        text: "Final Budget Review",
        startDate: new Date("2021-05-27T09:00:00.000Z"),
        endDate: new Date("2021-05-27T10:35:00.000Z")
    }, {
        text: "New Brochures",
        startDate: new Date("2021-05-27T11:30:00.000Z"),
        endDate: new Date("2021-05-27T12:45:00.000Z")
    }, {
        text: "Install New Database",
        startDate: new Date("2021-05-27T06:45:00.000Z"),
        endDate: new Date("2021-05-27T08:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-05-27T09:00:00.000Z"),
        endDate: new Date("2021-05-27T11:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-05-27T12:15:00.000Z"),
        endDate: new Date("2021-05-27T13:30:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-05-28T12:15:00.000Z"),
        endDate: new Date("2021-05-28T13:30:00.000Z")
    }
];

let priorities: Resource[] = [
    {
        text: "High priority",
        id: 1,
        color: "#cc5c53"
    }, {
        text: "Low priority",
        id: 2,
        color: "#ff9747"
    }
];


@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }
    getResources(): Resource[] {
        return priorities;
    }
}
