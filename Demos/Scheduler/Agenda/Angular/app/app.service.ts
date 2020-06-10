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
        startDate: new Date(2017, 4, 1, 9, 0),
        endDate: new Date(2017, 4, 1, 10, 30)
    }, {
        text: "New Brochures",
        startDate: new Date(2017, 4, 1, 11, 30),
        endDate: new Date(2017, 4, 1, 14, 15)
    }, {
        text: "Brochure Design Review",
        startDate: new Date(2017, 4, 1, 13, 15),
        endDate: new Date(2017, 4, 1, 16, 15)
    }, {
        text: "Website Re-Design Plan",
        startDate: new Date(2017, 4, 1, 16, 45),
        endDate: new Date(2017, 4, 2, 11, 15)
    }, {
        text: "Rollout of New Website and Marketing Brochures",
        startDate: new Date(2017, 4, 2, 8, 15),
        endDate: new Date(2017, 4, 2, 10, 45)
    }, {
        text: "Update Sales Strategy Documents",
        startDate: new Date(2017, 4, 2, 12, 0),
        endDate: new Date(2017, 4, 2, 13, 45)
    }, {
        text: "Non-Compete Agreements",
        startDate: new Date(2017, 4, 3, 8, 15),
        endDate: new Date(2017, 4, 3, 9, 0)
    }, {
        text: "Approve Hiring of John Jeffers",
        startDate: new Date(2017, 4, 3, 10, 0),
        endDate: new Date(2017, 4, 3, 11, 15)
    }, {
        text: "Update NDA Agreement",
        startDate: new Date(2017, 4, 3, 11, 45),
        endDate: new Date(2017, 4, 3, 13, 45)
    }, {
        text: "Update Employee Files with New NDA",
        startDate: new Date(2017, 4, 3, 14, 0),
        endDate: new Date(2017, 4, 3, 16, 45)
    }, {
        text: "Submit Questions Regarding New NDA",
        startDate: new Date(2017, 4, 4, 8, 0),
        endDate: new Date(2017, 4, 4, 9, 30)
    }, {
        text: "Submit Signed NDA",
        startDate: new Date(2017, 4, 4, 12, 45),
        endDate: new Date(2017, 4, 4, 14, 0)
    }, {
        text: "Review Revenue Projections",
        startDate: new Date(2017, 4, 4, 17, 15),
        endDate: new Date(2017, 4, 4, 18, 0)
    }, {
        text: "Comment on Revenue Projections",
        startDate: new Date(2017, 4, 5, 9, 15),
        endDate: new Date(2017, 4, 5, 11, 15)
    }, {
        text: "Provide New Health Insurance Docs",
        startDate: new Date(2017, 4, 5, 12, 45),
        endDate: new Date(2017, 4, 5, 14, 15)
    }, {
        text: "Review Changes to Health Insurance Coverage",
        startDate: new Date(2017, 4, 5, 14, 15),
        endDate: new Date(2017, 4, 5, 15, 30)
    }, {
        text: "Review Training Course for any Ommissions",
        startDate: new Date(2017, 4, 8, 14, 0),
        endDate: new Date(2017, 4, 9, 12, 0)
    }, {
        text: "Recall Rebate Form",
        startDate: new Date(2017, 4, 8, 12, 45),
        endDate: new Date(2017, 4, 8, 13, 15)
    }, {
        text: "Create Report on Customer Feedback",
        startDate: new Date(2017, 4, 9, 15, 15),
        endDate: new Date(2017, 4, 9, 17, 30)
    }, {
        text: "Review Customer Feedback Report",
        startDate: new Date(2017, 4, 9, 16, 15),
        endDate: new Date(2017, 4, 9, 18, 30)
    }, {
        text: "Customer Feedback Report Analysis",
        startDate: new Date(2017, 4, 10, 9, 30),
        endDate: new Date(2017, 4, 10, 10, 30)
    }, {
        text: "Prepare Shipping Cost Analysis Report",
        startDate: new Date(2017, 4, 10, 12, 30),
        endDate: new Date(2017, 4, 10, 13, 30)
    }, {
        text: "Provide Feedback on Shippers",
        startDate: new Date(2017, 4, 10, 14, 15),
        endDate: new Date(2017, 4, 10, 16, 0)
    }, {
        text: "Select Preferred Shipper",
        startDate: new Date(2017, 4, 10, 17, 30),
        endDate: new Date(2017, 4, 10, 20, 0)
    }, {
        text: "Complete Shipper Selection Form",
        startDate: new Date(2017, 4, 11, 8, 30),
        endDate: new Date(2017, 4, 11, 10, 0)
    }, {
        text: "Upgrade Server Hardware",
        startDate: new Date(2017, 4, 11, 12, 0),
        endDate: new Date(2017, 4, 11, 14, 15)
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date(2017, 4, 11, 14, 45),
        endDate: new Date(2017, 4, 11, 16, 30)
    }, {
        text: "Upgrade Apps to Windows RT or stay with WinForms",
        startDate: new Date(2017, 4, 12, 10, 30),
        endDate: new Date(2017, 4, 12, 13, 0)
    }, {
        text: "Estimate Time Required to Touch-Enable Apps",
        startDate: new Date(2017, 4, 12, 14, 45),
        endDate: new Date(2017, 4, 12, 16, 30)
    }, {
        text: "Report on Tranistion to Touch-Based Apps",
        startDate: new Date(2017, 4, 12, 18, 30),
        endDate: new Date(2017, 4, 12, 19, 0)
    }, {
        text: "Submit New Website Design",
        startDate: new Date(2017, 4, 15, 8, 0),
        endDate: new Date(2017, 4, 15, 10, 0)
    }, {
        text: "Create Icons for Website",
        startDate: new Date(2017, 4, 15, 11, 30),
        endDate: new Date(2017, 4, 15, 13, 15)
    }, {
        text: "Create New Product Pages",
        startDate: new Date(2017, 4, 16, 9, 45),
        endDate: new Date(2017, 4, 16, 11, 45)
    }, {
        text: "Approve Website Launch",
        startDate: new Date(2017, 4, 16, 12, 0),
        endDate: new Date(2017, 4, 16, 15, 15)
    }, {
        text: "Update Customer Shipping Profiles",
        startDate: new Date(2017, 4, 17, 9, 30),
        endDate: new Date(2017, 4, 17, 11, 0)
    }, {
        text: "Create New Shipping Return Labels",
        startDate: new Date(2017, 4, 17, 12, 45),
        endDate: new Date(2017, 4, 17, 14, 0)
    }, {
        text: "Get Design for Shipping Return Labels",
        startDate: new Date(2017, 4, 17, 15, 0),
        endDate: new Date(2017, 4, 17, 16, 30)
    }, {
        text: "PSD needed for Shipping Return Labels",
        startDate: new Date(2017, 4, 18, 8, 30),
        endDate: new Date(2017, 4, 18, 9, 15)
    }, {
        text: "Contact ISP and Discuss Payment Options",
        startDate: new Date(2017, 4, 18, 11, 30),
        endDate: new Date(2017, 4, 18, 16, 0)
    }, {
        text: "Prepare Year-End Support Summary Report",
        startDate: new Date(2017, 4, 18, 17, 0),
        endDate: new Date(2017, 4, 18, 20, 0)
    }, {
        text: "Review New Training Material",
        startDate: new Date(2017, 4, 19, 8, 0),
        endDate: new Date(2017, 4, 19, 9, 15)
    }, {
        text: "Distribute Training Material to Support Staff",
        startDate: new Date(2017, 4, 19, 12, 45),
        endDate: new Date(2017, 4, 19, 14, 0)
    }, {
        text: "Training Material Distribution Schedule",
        startDate: new Date(2017, 4, 19, 14, 15),
        endDate: new Date(2017, 4, 19, 16, 15)
    }, {
        text: "Approval on Converting to New HDMI Specification",
        startDate: new Date(2017, 4, 22, 9, 30),
        endDate: new Date(2017, 4, 22, 10, 15)
    }, {
        text: "Create New Spike for Automation Server",
        startDate: new Date(2017, 4, 22, 10, 0),
        endDate: new Date(2017, 4, 22, 12, 30)
    }, {
        text: "Code Review - New Automation Server",
        startDate: new Date(2017, 4, 22, 13, 0),
        endDate: new Date(2017, 4, 22, 15, 0)
    }, {
        text: "Confirm Availability for Sales Meeting",
        startDate: new Date(2017, 4, 23, 10, 15),
        endDate: new Date(2017, 4, 23, 15, 15)
    }, {
        text: "Reschedule Sales Team Meeting",
        startDate: new Date(2017, 4, 23, 16, 15),
        endDate: new Date(2017, 4, 23, 18, 0)
    }, {
        text: "Send 2 Remotes for Giveaways",
        startDate: new Date(2017, 4, 24, 9, 30),
        endDate: new Date(2017, 4, 24, 11, 45)
    }, {
        text: "Discuss Product Giveaways with Management",
        startDate: new Date(2017, 4, 24, 12, 15),
        endDate: new Date(2017, 4, 24, 16, 45)
    }, {
        text: "Replace Desktops on the 3rd Floor",
        startDate: new Date(2017, 4, 25, 9, 30),
        endDate: new Date(2017, 4, 25, 10, 45)
    }, {
        text: "Update Database with New Leads",
        startDate: new Date(2017, 4, 25, 12, 0),
        endDate: new Date(2017, 4, 25, 14, 15)
    }, {
        text: "Mail New Leads for Follow Up",
        startDate: new Date(2017, 4, 25, 14, 45),
        endDate: new Date(2017, 4, 25, 15, 30)
    }, {
        text: "Send Territory Sales Breakdown",
        startDate: new Date(2017, 4, 25, 18, 0),
        endDate: new Date(2017, 4, 25, 20, 0)
    }, {
        text: "Territory Sales Breakdown Report",
        startDate: new Date(2017, 4, 26, 8, 45),
        endDate: new Date(2017, 4, 26, 9, 45)
    }, {
        text: "Report on the State of Engineering Dept",
        startDate: new Date(2017, 4, 26, 14, 45),
        endDate: new Date(2017, 4, 26, 15, 30)
    }, {
        text: "Staff Productivity Report",
        startDate: new Date(2017, 4, 26, 16, 15),
        endDate: new Date(2017, 4, 26, 19, 30)
    }
];

@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }
}
