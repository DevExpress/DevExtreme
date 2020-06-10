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
        startDate: new Date(2017, 4, 5, 9, 0),
        endDate: new Date(2017, 4, 5, 10, 30)
    }, {
        text: "New Brochures",
        roomId: 5,
        startDate: new Date(2017, 4, 5, 11, 30),
        endDate: new Date(2017, 4, 5, 14, 15)
    }, {
        text: "Brochure Design Review",
        roomId: 5,
        startDate: new Date(2017, 4, 5, 13, 15),
        endDate: new Date(2017, 4, 5, 16, 15)
    }, {
        text: "Website Re-Design Plan",
        roomId: 5,
        startDate: new Date(2017, 4, 5, 16, 45),
        endDate: new Date(2017, 4, 5, 11, 15)
    }, {
        text: "Rollout of New Website and Marketing Brochures",
        roomId: 2,
        startDate: new Date(2017, 4, 9, 8, 15),
        endDate: new Date(2017, 4, 9, 10, 45)
    }, {
        text: "Update Sales Strategy Documents",
        roomId: 3,
        startDate: new Date(2017, 4, 9, 12, 0),
        endDate: new Date(2017, 4, 9, 13, 45)
    }, {
        text: "Non-Compete Agreements",
        roomId: 3,
        startDate: new Date(2017, 4, 9, 8, 15),
        endDate: new Date(2017, 4, 9, 9, 0)
    }, {
        text: "Update NDA Agreement",
        roomId: 1,
        startDate: new Date(2017, 4, 10, 11, 45),
        endDate: new Date(2017, 4, 10, 13, 45)
    }, {
        text: "Update Employee Files with New NDA",
        roomId: 4,
        startDate: new Date(2017, 4, 18, 14, 0),
        endDate: new Date(2017, 4, 18, 16, 45)
    }, {
        text: "Submit Questions Regarding New NDA",
        roomId: 4,
        startDate: new Date(2017, 4, 18, 8, 0),
        endDate: new Date(2017, 4, 18, 9, 30)
    }, {
        text: "Submit Signed NDA",
        roomId: 4,
        startDate: new Date(2017, 4, 18, 12, 45),
        endDate: new Date(2017, 4, 18, 14, 0)
    }, {
        text: "Review Revenue Projections",
        roomId: 4,
        startDate: new Date(2017, 4, 25, 17, 15),
        endDate: new Date(2017, 4, 25, 18, 0)
    }, {
        text: "Comment on Revenue Projections",
        roomId: 1,
        startDate: new Date(2017, 4, 22, 9, 15),
        endDate: new Date(2017, 4, 22, 11, 15)
    }, {
        text: "Provide New Health Insurance Docs",
        roomId: 4,
        startDate: new Date(2017, 4, 22, 12, 45),
        endDate: new Date(2017, 4, 22, 14, 15)
    }, {
        text: "Review Changes to Health Insurance Coverage",
        roomId: 4,
        startDate: new Date(2017, 4, 25, 14, 15),
        endDate: new Date(2017, 4, 25, 15, 30)
    }, {
        text: "Review Training Course for any Ommissions",
        roomId: 4,
        startDate: new Date(2017, 4, 22, 14, 0),
        endDate: new Date(2017, 4, 22, 12, 0)
    }, {
        text: "Recall Rebate Form",
        roomId: 2,
        startDate: new Date(2017, 4, 23, 12, 45),
        endDate: new Date(2017, 4, 23, 13, 15)
    }, {
        text: "Create Report on Customer Feedback",
        roomId: 3,
        startDate: new Date(2017, 4, 23, 15, 15),
        endDate: new Date(2017, 4, 23, 17, 30)
    }, {
        text: "Review Customer Feedback Report",
        roomId: 3,
        startDate: new Date(2017, 4, 17, 16, 15),
        endDate: new Date(2017, 4, 17, 18, 30)
    }, {
        text: "Customer Feedback Report Analysis",
        roomId: 3,
        startDate: new Date(2017, 4, 17, 9, 30),
        endDate: new Date(2017, 4, 17, 10, 30)
    }, {
        text: "Prepare Shipping Cost Analysis Report",
        roomId: 3,
        startDate: new Date(2017, 4, 23, 12, 30),
        endDate: new Date(2017, 4, 23, 13, 30)
    }, {
        text: "Provide Feedback on Shippers",
        roomId: 3,
        startDate: new Date(2017, 4, 23, 14, 15),
        endDate: new Date(2017, 4, 23, 16, 0)
    }, {
        text: "Select Preferred Shipper",
        roomId: 1,
        startDate: new Date(2017, 4, 26, 17, 30),
        endDate: new Date(2017, 4, 26, 20, 0)
    }, {
        text: "Complete Shipper Selection Form",
        roomId: 5,
        startDate: new Date(2017, 4, 25, 8, 30),
        endDate: new Date(2017, 4, 25, 10, 0)
    }, {
        text: "Upgrade Server Hardware",
        roomId: 5,
        startDate: new Date(2017, 4, 26, 12, 0),
        endDate: new Date(2017, 4, 26, 14, 15)
    }, {
        text: "Upgrade Personal Computers",
        roomId: 5,
        startDate: new Date(2017, 4, 26, 14, 45),
        endDate: new Date(2017, 4, 26, 16, 30)
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
