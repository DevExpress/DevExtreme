import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    priorityId: number;
    startDate: Date;
    endDate: Date;
    recurrenceRule?: string;
}

export class Priority {
    text: string;
    id: number;
    color: string;
}

let appointments: Appointment[] = [
    {
        text: "Website Re-Design Plan",
        priorityId: 2,
        startDate: new Date("2021-05-17T16:30:00.000Z"),
        endDate: new Date("2021-05-17T18:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        priorityId: 1,
        startDate: new Date("2021-05-20T17:00:00.000Z"),
        endDate: new Date("2021-05-20T19:00:00.000Z"),
    }, {
        text: "Install New Router in Dev Room",
        priorityId: 1,
        startDate: new Date("2021-05-16T20:00:00.000Z"),
        endDate: new Date("2021-05-16T22:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        priorityId: 2,
        startDate: new Date("2021-05-18T17:00:00.000Z"),
        endDate: new Date("2021-05-18T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        priorityId: 2,
        startDate: new Date("2021-05-18T19:00:00.000Z"),
        endDate: new Date("2021-05-18T20:35:00.000Z")
    }, {
        text: "New Brochures",
        priorityId: 2,
        startDate: new Date("2021-05-17T20:00:00.000Z"),
        endDate: new Date("2021-05-17T22:15:00.000Z")
    }, {
        text: "Install New Database",
        priorityId: 2,
        startDate: new Date("2021-05-09T16:00:00.000Z"),
        endDate: new Date("2021-05-11T19:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        priorityId: 2,
        startDate: new Date("2021-05-19T19:00:00.000Z"),
        endDate: new Date("2021-05-19T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        priorityId: 1,
        startDate: new Date("2021-05-09T16:00:00.000Z"),
        endDate: new Date("2021-05-09T18:30:00.000Z"),
        recurrenceRule: "FREQ=DAILY;COUNT=4"
    }, {
        text: "Prepare 2021 Marketing Plan",
        priorityId: 2,
        startDate: new Date("2021-05-20T18:00:00.000Z"),
        endDate: new Date("2021-05-20T20:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        priorityId: 1,
        startDate: new Date("2021-05-19T18:00:00.000Z"),
        endDate: new Date("2021-05-19T20:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        priorityId: 2,
        startDate: new Date("2021-05-21T17:00:00.000Z"),
        endDate: new Date("2021-05-21T18:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        priorityId: 1,
        startDate: new Date("2021-05-03T16:00:00.000Z"),
        endDate: new Date("2021-05-06T22:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        priorityId: 2,
        startDate: new Date("2021-05-21T23:30:00.000Z"),
        endDate: new Date("2021-05-22T01:00:00.000Z")
    }, {
        text: "Launch New Website",
        priorityId: 2,
        startDate: new Date("2021-05-22T19:20:00.000Z"),
        endDate: new Date("2021-05-22T21:00:00.000Z")
    }, {
        text: "Google AdWords Strategy",
        priorityId: 1,
        startDate: new Date("2021-05-24T16:00:00.000Z"),
        endDate: new Date("2021-05-24T19:00:00.000Z")
    }, {
        text: "Rollout of New Website and Marketing Brochures",
        priorityId: 1,
        startDate: new Date("2021-05-24T20:00:00.000Z"),
        endDate: new Date("2021-05-24T22:30:00.000Z")
    }, {
        text: "Non-Compete Agreements",
        priorityId: 2,
        startDate: new Date("2021-05-25T20:00:00.000Z"),
        endDate: new Date("2021-05-25T22:45:00.000Z")
    }, {
        text: "Approve Hiring of John Jeffers",
        priorityId: 2,
        startDate: new Date("2021-05-25T16:00:00.000Z"),
        endDate: new Date("2021-05-25T19:00:00.000Z")
    }, {
        text: "Update NDA Agreement",
        priorityId: 1,
        startDate: new Date("2021-05-25T18:00:00.000Z"),
        endDate: new Date("2021-05-25T21:15:00.000Z")
    }, {
        text: "Update Employee Files with New NDA",
        priorityId: 1,
        startDate: new Date("2021-05-28T16:00:00.000Z"),
        endDate: new Date("2021-05-28T18:45:00.000Z")
    }, {
        text: "Submit Questions Regarding New NDA",
        priorityId: 1,
        startDate: new Date("2021-05-26T17:00:00.000Z"),
        endDate: new Date("2021-05-26T18:30:00.000Z")
    }, {
        text: "Submit Signed NDA",
        priorityId: 1,
        startDate: new Date("2021-05-26T20:00:00.000Z"),
        endDate: new Date("2021-05-26T22:00:00.000Z")
    }, {
        text: "Review Revenue Projections",
        priorityId: 2,
        startDate: new Date("2021-05-26T18:00:00.000Z"),
        endDate: new Date("2021-05-26T21:00:00.000Z")
    }, {
        text: "Comment on Revenue Projections",
        priorityId: 2,
        startDate: new Date("2021-05-24T17:00:00.000Z"),
        endDate: new Date("2021-05-24T20:00:00.000Z")
    }, {
        text: "Provide New Health Insurance Docs",
        priorityId: 2,
        startDate: new Date("2021-05-28T19:00:00.000Z"),
        endDate: new Date("2021-05-28T22:00:00.000Z")
    }, {
        text: "Review Changes to Health Insurance Coverage",
        priorityId: 2,
        startDate: new Date("2021-05-27T16:00:00.000Z"),
        endDate: new Date("2021-05-27T20:00:00.000Z")
    }, {
        text: "Review Training Course for any Omissions",
        priorityId: 1,
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T21:00:00.000Z")
    }
];

let prioritiesData: Priority[] = [
    {
        text: "Low Priority",
        id: 1,
        color: "#1e90ff"
    }, {
        text: "High Priority",
        id: 2,
        color: "#ff9747"
    }
];

@Injectable()
export class Service {
    getAppointments(){
        return appointments;
    }
    getPriorities() {
        return prioritiesData;
    }
}
