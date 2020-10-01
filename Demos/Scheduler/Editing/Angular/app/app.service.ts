import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
    recurrenceRule?: string;
}

let appointments: Appointment[] = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date("2021-05-17T06:30:00.000Z"),
        endDate: new Date("2021-05-17T08:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date("2021-05-17T09:00:00.000Z"),
        endDate: new Date("2021-05-17T10:00:00.000Z"),
        allDay: true
    }, {
        text: "Install New Router in Dev Room",
        startDate: new Date("2021-05-17T11:30:00.000Z"),
        endDate: new Date("2021-05-17T12:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-05-18T07:00:00.000Z"),
        endDate: new Date("2021-05-18T08:00:00.000Z")
    }, {
        text: "Final Budget Review",
        startDate: new Date("2021-05-18T09:00:00.000Z"),
        endDate: new Date("2021-05-18T10:35:00.000Z")
    }, {
        text: "New Brochures",
        startDate: new Date("2021-05-18T11:30:00.000Z"),
        endDate: new Date("2021-05-18T12:45:00.000Z")
    }, {
        text: "Install New Database",
        startDate: new Date("2021-05-19T06:45:00.000Z"),
        endDate: new Date("2021-05-19T08:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-05-19T09:00:00.000Z"),
        endDate: new Date("2021-05-19T11:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-05-19T12:15:00.000Z"),
        endDate: new Date("2021-05-19T13:30:00.000Z")
    }, {
        text: "Customer Workshop",
        startDate: new Date("2021-05-20T08:00:00.000Z"),
        endDate: new Date("2021-05-20T09:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date("2021-05-20T08:00:00.000Z"),
        endDate: new Date("2021-05-20T10:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        startDate: new Date("2021-05-20T11:00:00.000Z"),
        endDate: new Date("2021-05-20T12:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        startDate: new Date("2021-05-21T07:00:00.000Z"),
        endDate: new Date("2021-05-21T08:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        startDate: new Date("2021-05-21T11:30:00.000Z"),
        endDate: new Date("2021-05-21T13:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        startDate: new Date("2021-05-21T13:30:00.000Z"),
        endDate: new Date("2021-05-21T15:00:00.000Z")
    }, {
        text: "Launch New Website",
        startDate: new Date("2021-05-21T09:20:00.000Z"),
        endDate: new Date("2021-05-21T11:00:00.000Z")
    }
];  

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }
}
