import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
}

export class Task {
    text: string;
}


let appointments: Appointment[] = [
    {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date("2021-04-26T19:00:00.000Z"),
        endDate: new Date("2021-04-26T20:00:00.000Z"),
        allDay: true
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-04-27T17:00:00.000Z"),
        endDate: new Date("2021-04-27T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        startDate: new Date("2021-04-27T19:00:00.000Z"),
        endDate: new Date("2021-04-27T20:35:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-04-28T19:00:00.000Z"),
        endDate: new Date("2021-04-28T21:00:00.000Z")
    }, {
        text: "Customer Workshop",
        startDate: new Date("2021-04-29T18:00:00.000Z"),
        endDate: new Date("2021-04-29T19:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date("2021-04-29T18:00:00.000Z"),
        endDate: new Date("2021-04-29T20:30:00.000Z")
    }
];

let tasks: Task[] = [
    {
        text: "New Brochures"
    }, {
        text: "Brochure Design Review"
    }, {
        text: "Upgrade Personal Computers"
    }, {
        text: "Install New Router in Dev Room"
    }, {
        text: "Upgrade Server Hardware"
    }, {
        text: "Install New Database"
    }, {
        text: "Website Re-Design Plan"
    }, {
        text: "Create Icons for Website"
    }, {
        text: "Submit New Website Design"
    }, {
        text: "Launch New Website"
    }
];

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }

    getTasks(): Task[] {
        return tasks;
    }
}
