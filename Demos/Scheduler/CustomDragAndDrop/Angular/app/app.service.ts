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
        startDate: new Date(2017, 4, 22, 12, 0),
        endDate: new Date(2017, 4, 22, 13, 0),
        allDay: true
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date(2017, 4, 23, 10, 0),
        endDate: new Date(2017, 4, 23, 11, 0)
    }, {
        text: "Final Budget Review",
        startDate: new Date(2017, 4, 23, 12, 0),
        endDate: new Date(2017, 4, 23, 13, 35)
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date(2017, 4, 24, 12, 0),
        endDate: new Date(2017, 4, 24, 14, 0)
    }, {
        text: "Customer Workshop",
        startDate: new Date(2017, 4, 25, 11, 0),
        endDate: new Date(2017, 4, 25, 12, 0),
        allDay: true
    }, {
        text: "Prepare 2015 Marketing Plan",
        startDate: new Date(2017, 4, 25, 11, 0),
        endDate: new Date(2017, 4, 25, 13, 30)
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
