import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    roomId: number;
    startDate: Date;
    endDate: Date;
}

export class Resource {
    text: string;
    id: number;
    color: string;
}

let appointments: Appointment[] = [
    {
        text: "Google AdWords Strategy",
        roomId: 1,
        startDate: new Date("2021-04-30T06:00:00.000Z"),
        endDate: new Date("2021-04-30T07:30:00.000Z")
    }, {
        text: "New Brochures",
        roomId: 5,
        startDate: new Date("2021-04-30T08:30:00.000Z"),
        endDate: new Date("2021-04-30T11:15:00.000Z")
    }, {
        text: "Brochure Design Review",
        roomId: 5,
        startDate: new Date("2021-04-30T10:15:00.000Z"),
        endDate: new Date("2021-04-30T13:15:00.000Z")
    }, {
        text: "Website Re-Design Plan",
        roomId: 5,
        startDate: new Date("2021-04-30T13:45:00.000Z"),
        endDate: new Date("2021-04-30T08:15:00.000Z")
    }, {
        text: "Rollout of New Website and Marketing Brochures",
        roomId: 2,
        startDate: new Date("2021-05-04T05:15:00.000Z"),
        endDate: new Date("2021-05-04T07:45:00.000Z")
    }, {
        text: "Update Sales Strategy Documents",
        roomId: 3,
        startDate: new Date("2021-05-04T09:00:00.000Z"),
        endDate: new Date("2021-05-04T10:45:00.000Z")
    }, {
        text: "Non-Compete Agreements",
        roomId: 3,
        startDate: new Date("2021-05-04T05:15:00.000Z"),
        endDate: new Date("2021-05-04T06:00:00.000Z")
    }, {
        text: "Update NDA Agreement",
        roomId: 1,
        startDate: new Date("2021-05-05T08:45:00.000Z"),
        endDate: new Date("2021-05-05T10:45:00.000Z")
    }, {
        text: "Update Employee Files with New NDA",
        roomId: 4,
        startDate: new Date("2021-05-13T11:00:00.000Z"),
        endDate: new Date("2021-05-13T13:45:00.000Z")
    }, {
        text: "Submit Questions Regarding New NDA",
        roomId: 4,
        startDate: new Date("2021-05-13T05:00:00.000Z"),
        endDate: new Date("2021-05-13T06:30:00.000Z")
    }, {
        text: "Submit Signed NDA",
        roomId: 4,
        startDate: new Date("2021-05-13T09:45:00.000Z"),
        endDate: new Date("2021-05-13T11:00:00.000Z")
    }, {
        text: "Review Revenue Projections",
        roomId: 4,
        startDate: new Date("2021-05-20T14:15:00.000Z"),
        endDate: new Date("2021-05-20T15:00:00.000Z")
    }, {
        text: "Comment on Revenue Projections",
        roomId: 1,
        startDate: new Date("2021-05-17T06:15:00.000Z"),
        endDate: new Date("2021-05-17T08:15:00.000Z")
    }, {
        text: "Provide New Health Insurance Docs",
        roomId: 4,
        startDate: new Date("2021-05-17T09:45:00.000Z"),
        endDate: new Date("2021-05-17T11:15:00.000Z")
    }, {
        text: "Review Changes to Health Insurance Coverage",
        roomId: 4,
        startDate: new Date("2021-05-20T11:15:00.000Z"),
        endDate: new Date("2021-05-20T12:30:00.000Z")
    }, {
        text: "Review Training Course for any Ommissions",
        roomId: 4,
        startDate: new Date("2021-05-17T11:00:00.000Z"),
        endDate: new Date("2021-05-17T09:00:00.000Z")
    }, {
        text: "Recall Rebate Form",
        roomId: 2,
        startDate: new Date("2021-05-18T09:45:00.000Z"),
        endDate: new Date("2021-05-18T10:15:00.000Z")
    }, {
        text: "Create Report on Customer Feedback",
        roomId: 3,
        startDate: new Date("2021-05-18T12:15:00.000Z"),
        endDate: new Date("2021-05-18T14:30:00.000Z")
    }, {
        text: "Review Customer Feedback Report",
        roomId: 3,
        startDate: new Date("2021-05-12T13:15:00.000Z"),
        endDate: new Date("2021-05-12T15:30:00.000Z")
    }, {
        text: "Customer Feedback Report Analysis",
        roomId: 3,
        startDate: new Date("2021-05-12T06:30:00.000Z"),
        endDate: new Date("2021-05-12T07:30:00.000Z")
    }, {
        text: "Prepare Shipping Cost Analysis Report",
        roomId: 3,
        startDate: new Date("2021-05-18T09:30:00.000Z"),
        endDate: new Date("2021-05-18T10:30:00.000Z")
    }, {
        text: "Provide Feedback on Shippers",
        roomId: 3,
        startDate: new Date("2021-05-18T11:15:00.000Z"),
        endDate: new Date("2021-05-18T13:00:00.000Z")
    }, {
        text: "Select Preferred Shipper",
        roomId: 1,
        startDate: new Date("2021-05-21T14:30:00.000Z"),
        endDate: new Date("2021-05-21T17:00:00.000Z")
    }, {
        text: "Complete Shipper Selection Form",
        roomId: 5,
        startDate: new Date("2021-05-20T05:30:00.000Z"),
        endDate: new Date("2021-05-20T07:00:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        roomId: 5,
        startDate: new Date("2021-05-21T09:00:00.000Z"),
        endDate: new Date("2021-05-21T11:15:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        roomId: 5,
        startDate: new Date("2021-05-21T11:45:00.000Z"),
        endDate: new Date("2021-05-21T13:30:00.000Z")
    }
];

let resources: Resource[] = [
    {
        text: "Room 401",
        id: 1,
        color: "#bbd806"
    }, {
        text: "Room 402",
        id: 2,
        color: "#f34c8a"
    }, {
        text: "Room 403",
        id: 3,
        color: "#ae7fcc"
    }, {
        text: "Room 407",
        id: 4,
        color: "#ff8817"
    }, {
        text: "Room 409",
        id: 5,
        color: "#03bb92"
    }
];

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }
    getResources(): Resource[] {
        return resources;
    }
}
