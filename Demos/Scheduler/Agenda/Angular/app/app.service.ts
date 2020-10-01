import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
}

let appointments: Appointment[] = [
    {
        text: "Google AdWords Strategy",
        startDate: new Date("2021-05-03T06:00:00.000Z"),
        endDate: new Date("2021-05-03T07:30:00.000Z")
    }, {
        text: "New Brochures",
        startDate: new Date("2021-05-03T08:30:00.000Z"),
        endDate: new Date("2021-05-03T11:15:00.000Z")
    }, {
        text: "Brochure Design Review",
        startDate: new Date("2021-05-03T10:15:00.000Z"),
        endDate: new Date("2021-05-03T13:15:00.000Z")
    }, {
        text: "Website Re-Design Plan",
        startDate: new Date("2021-05-03T13:45:00.000Z"),
        endDate: new Date("2021-05-04T08:15:00.000Z")
    }, {
        text: "Rollout of New Website and Marketing Brochures",
        startDate: new Date("2021-05-04T05:15:00.000Z"),
        endDate: new Date("2021-05-04T07:45:00.000Z")
    }, {
        text: "Update Sales Strategy Documents",
        startDate: new Date("2021-05-04T09:00:00.000Z"),
        endDate: new Date("2021-05-04T10:45:00.000Z")
    }, {
        text: "Non-Compete Agreements",
        startDate: new Date("2021-05-05T05:15:00.000Z"),
        endDate: new Date("2021-05-05T06:00:00.000Z")
    }, {
        text: "Approve Hiring of John Jeffers",
        startDate: new Date("2021-05-05T07:00:00.000Z"),
        endDate: new Date("2021-05-05T08:15:00.000Z")
    }, {
        text: "Update NDA Agreement",
        startDate: new Date("2021-05-05T08:45:00.000Z"),
        endDate: new Date("2021-05-05T10:45:00.000Z")
    }, {
        text: "Update Employee Files with New NDA",
        startDate: new Date("2021-05-05T11:00:00.000Z"),
        endDate: new Date("2021-05-05T13:45:00.000Z")
    }, {
        text: "Submit Questions Regarding New NDA",
        startDate: new Date("2021-05-06T05:00:00.000Z"),
        endDate: new Date("2021-05-06T06:30:00.000Z")
    }, {
        text: "Submit Signed NDA",
        startDate: new Date("2021-05-06T09:45:00.000Z"),
        endDate: new Date("2021-05-06T11:00:00.000Z")
    }, {
        text: "Review Revenue Projections",
        startDate: new Date("2021-05-06T14:15:00.000Z"),
        endDate: new Date("2021-05-06T15:00:00.000Z")
    }, {
        text: "Comment on Revenue Projections",
        startDate: new Date("2021-05-07T06:15:00.000Z"),
        endDate: new Date("2021-05-07T08:15:00.000Z")
    }, {
        text: "Provide New Health Insurance Docs",
        startDate: new Date("2021-05-07T09:45:00.000Z"),
        endDate: new Date("2021-05-07T11:15:00.000Z")
    }, {
        text: "Review Changes to Health Insurance Coverage",
        startDate: new Date("2021-05-07T11:15:00.000Z"),
        endDate: new Date("2021-05-07T12:30:00.000Z")
    }, {
        text: "Review Training Course for any Ommissions",
        startDate: new Date("2021-05-10T11:00:00.000Z"),
        endDate: new Date("2021-05-11T09:00:00.000Z")
    }, {
        text: "Recall Rebate Form",
        startDate: new Date("2021-05-10T09:45:00.000Z"),
        endDate: new Date("2021-05-10T10:15:00.000Z")
    }, {
        text: "Create Report on Customer Feedback",
        startDate: new Date("2021-05-11T12:15:00.000Z"),
        endDate: new Date("2021-05-11T14:30:00.000Z")
    }, {
        text: "Review Customer Feedback Report",
        startDate: new Date("2021-05-11T13:15:00.000Z"),
        endDate: new Date("2021-05-11T15:30:00.000Z")
    }, {
        text: "Customer Feedback Report Analysis",
        startDate: new Date("2021-05-12T06:30:00.000Z"),
        endDate: new Date("2021-05-12T07:30:00.000Z")
    }, {
        text: "Prepare Shipping Cost Analysis Report",
        startDate: new Date("2021-05-12T09:30:00.000Z"),
        endDate: new Date("2021-05-12T10:30:00.000Z")
    }, {
        text: "Provide Feedback on Shippers",
        startDate: new Date("2021-05-12T11:15:00.000Z"),
        endDate: new Date("2021-05-12T13:00:00.000Z")
    }, {
        text: "Select Preferred Shipper",
        startDate: new Date("2021-05-12T14:30:00.000Z"),
        endDate: new Date("2021-05-12T17:00:00.000Z")
    }, {
        text: "Complete Shipper Selection Form",
        startDate: new Date("2021-05-13T05:30:00.000Z"),
        endDate: new Date("2021-05-13T07:00:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        startDate: new Date("2021-05-13T09:00:00.000Z"),
        endDate: new Date("2021-05-13T11:15:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-05-13T11:45:00.000Z"),
        endDate: new Date("2021-05-13T13:30:00.000Z")
    }, {
        text: "Upgrade Apps to Windows RT or stay with WinForms",
        startDate: new Date("2021-05-14T07:30:00.000Z"),
        endDate: new Date("2021-05-14T10:00:00.000Z")
    }, {
        text: "Estimate Time Required to Touch-Enable Apps",
        startDate: new Date("2021-05-14T11:45:00.000Z"),
        endDate: new Date("2021-05-14T13:30:00.000Z")
    }, {
        text: "Report on Tranistion to Touch-Based Apps",
        startDate: new Date("2021-05-14T15:30:00.000Z"),
        endDate: new Date("2021-05-14T16:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        startDate: new Date("2021-05-17T05:00:00.000Z"),
        endDate: new Date("2021-05-17T07:00:00.000Z")
    }, {
        text: "Create Icons for Website",
        startDate: new Date("2021-05-17T08:30:00.000Z"),
        endDate: new Date("2021-05-17T10:15:00.000Z")
    }, {
        text: "Create New Product Pages",
        startDate: new Date("2021-05-18T06:45:00.000Z"),
        endDate: new Date("2021-05-18T08:45:00.000Z")
    }, {
        text: "Approve Website Launch",
        startDate: new Date("2021-05-18T09:00:00.000Z"),
        endDate: new Date("2021-05-18T12:15:00.000Z")
    }, {
        text: "Update Customer Shipping Profiles",
        startDate: new Date("2021-05-19T06:30:00.000Z"),
        endDate: new Date("2021-05-19T08:00:00.000Z")
    }, {
        text: "Create New Shipping Return Labels",
        startDate: new Date("2021-05-19T09:45:00.000Z"),
        endDate: new Date("2021-05-19T11:00:00.000Z")
    }, {
        text: "Get Design for Shipping Return Labels",
        startDate: new Date("2021-05-19T12:00:00.000Z"),
        endDate: new Date("2021-05-19T13:30:00.000Z")
    }, {
        text: "PSD needed for Shipping Return Labels",
        startDate: new Date("2021-05-20T05:30:00.000Z"),
        endDate: new Date("2021-05-20T06:15:00.000Z")
    }, {
        text: "Contact ISP and Discuss Payment Options",
        startDate: new Date("2021-05-20T08:30:00.000Z"),
        endDate: new Date("2021-05-20T13:00:00.000Z")
    }, {
        text: "Prepare Year-End Support Summary Report",
        startDate: new Date("2021-05-20T14:00:00.000Z"),
        endDate: new Date("2021-05-20T17:00:00.000Z")
    }, {
        text: "Review New Training Material",
        startDate: new Date("2021-05-21T05:00:00.000Z"),
        endDate: new Date("2021-05-21T06:15:00.000Z")
    }, {
        text: "Distribute Training Material to Support Staff",
        startDate: new Date("2021-05-21T09:45:00.000Z"),
        endDate: new Date("2021-05-21T11:00:00.000Z")
    }, {
        text: "Training Material Distribution Schedule",
        startDate: new Date("2021-05-21T11:15:00.000Z"),
        endDate: new Date("2021-05-21T13:15:00.000Z")
    }, {
        text: "Approval on Converting to New HDMI Specification",
        startDate: new Date("2021-05-24T06:30:00.000Z"),
        endDate: new Date("2021-05-24T07:15:00.000Z")
    }, {
        text: "Create New Spike for Automation Server",
        startDate: new Date("2021-05-24T07:00:00.000Z"),
        endDate: new Date("2021-05-24T09:30:00.000Z")
    }, {
        text: "Code Review - New Automation Server",
        startDate: new Date("2021-05-24T10:00:00.000Z"),
        endDate: new Date("2021-05-24T12:00:00.000Z")
    }, {
        text: "Confirm Availability for Sales Meeting",
        startDate: new Date("2021-05-25T07:15:00.000Z"),
        endDate: new Date("2021-05-25T12:15:00.000Z")
    }, {
        text: "Reschedule Sales Team Meeting",
        startDate: new Date("2021-05-25T13:15:00.000Z"),
        endDate: new Date("2021-05-25T15:00:00.000Z")
    }, {
        text: "Send 2 Remotes for Giveaways",
        startDate: new Date("2021-05-26T06:30:00.000Z"),
        endDate: new Date("2021-05-26T08:45:00.000Z")
    }, {
        text: "Discuss Product Giveaways with Management",
        startDate: new Date("2021-05-26T09:15:00.000Z"),
        endDate: new Date("2021-05-26T13:45:00.000Z")
    }, {
        text: "Replace Desktops on the 3rd Floor",
        startDate: new Date("2021-05-27T06:30:00.000Z"),
        endDate: new Date("2021-05-27T07:45:00.000Z")
    }, {
        text: "Update Database with New Leads",
        startDate: new Date("2021-05-27T09:00:00.000Z"),
        endDate: new Date("2021-05-27T11:15:00.000Z")
    }, {
        text: "Mail New Leads for Follow Up",
        startDate: new Date("2021-05-27T11:45:00.000Z"),
        endDate: new Date("2021-05-27T12:30:00.000Z")
    }, {
        text: "Send Territory Sales Breakdown",
        startDate: new Date("2021-05-27T15:00:00.000Z"),
        endDate: new Date("2021-05-27T17:00:00.000Z")
    }, {
        text: "Territory Sales Breakdown Report",
        startDate: new Date("2021-05-28T05:45:00.000Z"),
        endDate: new Date("2021-05-28T06:45:00.000Z")
    }, {
        text: "Report on the State of Engineering Dept",
        startDate: new Date("2021-05-28T11:45:00.000Z"),
        endDate: new Date("2021-05-28T12:30:00.000Z")
    }, {
        text: "Staff Productivity Report",
        startDate: new Date("2021-05-28T13:15:00.000Z"),
        endDate: new Date("2021-05-28T16:30:00.000Z")
    }
];

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }
}
