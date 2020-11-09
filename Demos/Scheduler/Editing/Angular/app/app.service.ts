import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
}

let appointments: Appointment[] = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date("2021-05-24T16:30:00.000Z"),
        endDate: new Date("2021-05-24T18:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date("2021-05-24T19:00:00.000Z"),
        endDate: new Date("2021-05-24T20:00:00.000Z"),
        allDay: true
    }, {
        text: "Install New Router in Dev Room",
        startDate: new Date("2021-05-24T21:30:00.000Z"),
        endDate: new Date("2021-05-24T22:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-05-25T17:00:00.000Z"),
        endDate: new Date("2021-05-25T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        startDate: new Date("2021-05-25T19:00:00.000Z"),
        endDate: new Date("2021-05-25T20:35:00.000Z")
    }, {
        text: "New Brochures",
        startDate: new Date("2021-05-25T21:30:00.000Z"),
        endDate: new Date("2021-05-25T22:45:00.000Z")
    }, {
        text: "Install New Database",
        startDate: new Date("2021-05-26T16:45:00.000Z"),
        endDate: new Date("2021-05-26T18:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-05-26T19:00:00.000Z"),
        endDate: new Date("2021-05-26T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-05-26T22:15:00.000Z"),
        endDate: new Date("2021-05-26T23:30:00.000Z")
    }, {
        text: "Customer Workshop",
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T19:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T20:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        startDate: new Date("2021-05-27T21:00:00.000Z"),
        endDate: new Date("2021-05-27T22:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        startDate: new Date("2021-05-28T17:00:00.000Z"),
        endDate: new Date("2021-05-28T18:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        startDate: new Date("2021-05-28T21:30:00.000Z"),
        endDate: new Date("2021-05-28T23:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        startDate: new Date("2021-05-28T23:30:00.000Z"),
        endDate: new Date("2021-05-29T01:00:00.000Z")
    }, {
        text: "Launch New Website",
        startDate: new Date("2021-05-28T19:20:00.000Z"),
        endDate: new Date("2021-05-28T21:00:00.000Z")
    }
];

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }
}
