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
        startDate: new Date("2021-05-24T09:00:00.000Z"),
        endDate: new Date("2021-05-24T10:00:00.000Z"),
        allDay: true
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-05-25T07:00:00.000Z"),
        endDate: new Date("2021-05-25T08:00:00.000Z")
    }, {
        text: "Final Budget Review",
        startDate: new Date("2021-05-25T09:00:00.000Z"),
        endDate: new Date("2021-05-25T10:35:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-05-26T09:00:00.000Z"),
        endDate: new Date("2021-05-26T11:00:00.000Z")
    }, {
        text: "Customer Workshop",
        startDate: new Date("2021-05-27T08:00:00.000Z"),
        endDate: new Date("2021-05-27T09:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date("2021-05-27T08:00:00.000Z"),
        endDate: new Date("2021-05-27T10:30:00.000Z")
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
