var resourcesData = [
    {
        text: "Samantha Bright",
        id: 1,
        color: "#cb6bb2"
    }, {
        text: "John Heart",
        id: 2,
        color: "#56ca85"
    }, {
        text: "Todd Hoffman",
        id: 3,
        color: "#1e90ff"
    }, {
        text: "Sandra Johnson",
        id: 4,
        color: "#ff9747"
    }
];

var priorityData = [
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

var data = [{
    text: "Google AdWords Strategy",
    ownerId: [2],
    startDate: new Date("2021-02-01T06:00:00.000Z"),
    endDate: new Date("2021-02-01T07:30:00.000Z"),
    priority: 1
}, {
    text: "New Brochures",
    ownerId: [1],
    startDate: new Date("2021-02-01T08:30:00.000Z"),
    endDate: new Date("2021-02-01T11:15:00.000Z"),
    priority: 2
}, {
    text: "Brochure Design Review",
    ownerId: [4],
    startDate: new Date("2021-02-01T10:15:00.000Z"),
    endDate: new Date("2021-02-01T13:15:00.000Z"),
    priority: 1
}, {
    text: "Website Re-Design Plan",
    ownerId: [3],
    startDate: new Date("2021-02-01T13:45:00.000Z"),
    endDate: new Date("2021-02-02T08:15:00.000Z"),
    priority: 2
}, {
    text: "Rollout of New Website and Marketing Brochures",
    ownerId: [1],
    startDate: new Date("2021-02-02T05:15:00.000Z"),
    endDate: new Date("2021-02-02T07:45:00.000Z"),
    priority: 2
}, {
    text: "Update Sales Strategy Documents",
    ownerId: [2],
    startDate: new Date("2021-02-02T09:00:00.000Z"),
    endDate: new Date("2021-02-02T10:45:00.000Z"),
    priority: 1
}, {
    text: "Non-Compete Agreements",
    ownerId: [4],
    startDate: new Date("2021-02-03T05:15:00.000Z"),
    endDate: new Date("2021-02-03T06:00:00.000Z"),
    priority: 1
}, {
    text: "Approve Hiring of John Jeffers",
    ownerId: [2],
    startDate: new Date("2021-02-03T07:00:00.000Z"),
    endDate: new Date("2021-02-03T08:15:00.000Z"),
    priority: 2
}, {
    text: "Update NDA Agreement",
    ownerId: [1],
    startDate: new Date("2021-02-03T08:45:00.000Z"),
    endDate: new Date("2021-02-03T10:45:00.000Z"),
    priority: 2
}, {
    text: "Update Employee Files with New NDA",
    ownerId: [2],
    startDate: new Date("2021-02-03T11:00:00.000Z"),
    endDate: new Date("2021-02-03T13:45:00.000Z"),
    priority: 1
}, {
    text: "Submit Questions Regarding New NDA",
    ownerId: [1],
    startDate: new Date("2021-02-04T05:00:00.000Z"),
    endDate: new Date("2021-02-04T06:30:00.000Z"),
    priority: 1
}, {
    text: "Submit Signed NDA",
    ownerId: [2],
    startDate: new Date("2021-02-04T09:45:00.000Z"),
    endDate: new Date("2021-02-04T11:00:00.000Z"),
    priority: 1
}, {
    text: "Review Revenue Projections",
    ownerId: [3],
    startDate: new Date("2021-02-04T14:15:00.000Z"),
    endDate: new Date("2021-02-04T15:00:00.000Z"),
    priority: 2
}, {
    text: "Comment on Revenue Projections",
    ownerId: [2],
    startDate: new Date("2021-02-05T06:15:00.000Z"),
    endDate: new Date("2021-02-05T08:15:00.000Z"),
    priority: 1
}, {
    text: "Provide New Health Insurance Docs",
    ownerId: [3],
    startDate: new Date("2021-02-05T09:45:00.000Z"),
    endDate: new Date("2021-02-05T11:15:00.000Z"),
    priority: 2
}, {
    text: "Review Changes to Health Insurance Coverage",
    ownerId: [2],
    startDate: new Date("2021-02-05T11:15:00.000Z"),
    endDate: new Date("2021-02-05T12:30:00.000Z"),
    priority: 1
}, {
    text: "Review Training Course for any Ommissions",
    ownerId: [2],
    startDate: new Date("2021-02-08T11:00:00.000Z"),
    endDate: new Date("2021-02-09T09:00:00.000Z"),
    priority: 2
}, {
    text: "Recall Rebate Form",
    ownerId: [1],
    startDate: new Date("2021-02-08T09:45:00.000Z"),
    endDate: new Date("2021-02-08T10:15:00.000Z"),
    priority: 1
}, {
    text: "Create Report on Customer Feedback",
    ownerId: [4],
    startDate: new Date("2021-02-09T12:15:00.000Z"),
    endDate: new Date("2021-02-09T14:30:00.000Z"),
    priority: 2
}, {
    text: "Review Customer Feedback Report",
    ownerId: [2],
    startDate: new Date("2021-02-09T13:15:00.000Z"),
    endDate: new Date("2021-02-09T15:30:00.000Z"),
    priority: 1
}, {
    text: "Customer Feedback Report Analysis",
    ownerId: [3],
    startDate: new Date("2021-02-10T06:30:00.000Z"),
    endDate: new Date("2021-02-10T07:30:00.000Z"),
    priority: 1
}, {
    text: "Prepare Shipping Cost Analysis Report",
    ownerId: [4],
    startDate: new Date("2021-02-10T09:30:00.000Z"),
    endDate: new Date("2021-02-10T10:30:00.000Z"),
    priority: 1
}, {
    text: "Provide Feedback on Shippers",
    ownerId: [2],
    startDate: new Date("2021-02-10T11:15:00.000Z"),
    endDate: new Date("2021-02-10T13:00:00.000Z"),
    priority: 2
}, {
    text: "Select Preferred Shipper",
    ownerId: [1],
    startDate: new Date("2021-02-10T14:30:00.000Z"),
    endDate: new Date("2021-02-10T17:00:00.000Z"),
    priority: 1
}, {
    text: "Complete Shipper Selection Form",
    ownerId: [2],
    startDate: new Date("2021-02-11T05:30:00.000Z"),
    endDate: new Date("2021-02-11T07:00:00.000Z"),
    priority: 2
}, {
    text: "Upgrade Server Hardware",
    ownerId: [4],
    startDate: new Date("2021-02-11T09:00:00.000Z"),
    endDate: new Date("2021-02-11T11:15:00.000Z"),
    priority: 1
}, {
    text: "Upgrade Personal Computers",
    ownerId: [3],
    startDate: new Date("2021-02-11T11:45:00.000Z"),
    endDate: new Date("2021-02-11T13:30:00.000Z"),
    priority: 1
}, {
    text: "Upgrade Apps to Windows RT or stay with WinForms",
    ownerId: [1],
    startDate: new Date("2021-02-12T07:30:00.000Z"),
    endDate: new Date("2021-02-12T10:00:00.000Z"),
    priority: 1
}, {
    text: "Estimate Time Required to Touch-Enable Apps",
    ownerId: [1],
    startDate: new Date("2021-02-12T11:45:00.000Z"),
    endDate: new Date("2021-02-12T13:30:00.000Z"),
    priority: 1
}, {
    text: "Report on Tranistion to Touch-Based Apps",
    ownerId: [2],
    startDate: new Date("2021-02-12T15:30:00.000Z"),
    endDate: new Date("2021-02-12T16:00:00.000Z"),
    priority: 1
}, {
    text: "Submit New Website Design",
    ownerId: [2],
    startDate: new Date("2021-02-15T05:00:00.000Z"),
    endDate: new Date("2021-02-15T07:00:00.000Z"),
    priority: 2
}, {
    text: "Create Icons for Website",
    ownerId: [4],
    startDate: new Date("2021-02-15T08:30:00.000Z"),
    endDate: new Date("2021-02-15T10:15:00.000Z"),
    priority: 1
}, {
    text: "Create New Product Pages",
    ownerId: [1],
    startDate: new Date("2021-02-16T06:45:00.000Z"),
    endDate: new Date("2021-02-16T08:45:00.000Z"),
    priority: 2
}, {
    text: "Approve Website Launch",
    ownerId: [3],
    startDate: new Date("2021-02-16T09:00:00.000Z"),
    endDate: new Date("2021-02-16T12:15:00.000Z"),
    priority: 1
}, {
    text: "Update Customer Shipping Profiles",
    ownerId: [3],
    startDate: new Date("2021-02-17T06:30:00.000Z"),
    endDate: new Date("2021-02-17T08:00:00.000Z"),
    priority: 1
}, {
    text: "Create New Shipping Return Labels",
    ownerId: [4],
    startDate: new Date("2021-02-17T09:45:00.000Z"),
    endDate: new Date("2021-02-17T11:00:00.000Z"),
    priority: 1
}, {
    text: "Get Design for Shipping Return Labels",
    ownerId: [3],
    startDate: new Date("2021-02-17T12:00:00.000Z"),
    endDate: new Date("2021-02-17T13:30:00.000Z"),
    priority: 1
}, {
    text: "PSD needed for Shipping Return Labels",
    ownerId: [4],
    startDate: new Date("2021-02-18T05:30:00.000Z"),
    endDate: new Date("2021-02-18T06:15:00.000Z"),
    priority: 2
}, {
    text: "Contact ISP and Discuss Payment Options",
    ownerId: [1],
    startDate: new Date("2021-02-18T08:30:00.000Z"),
    endDate: new Date("2021-02-18T13:00:00.000Z"),
    priority: 2
}, {
    text: "Prepare Year-End Support Summary Report",
    ownerId: [2],
    startDate: new Date("2021-02-18T14:00:00.000Z"),
    endDate: new Date("2021-02-18T17:00:00.000Z"),
    priority: 1
}, {
    text: "Review New Training Material",
    ownerId: [3],
    startDate: new Date("2021-02-19T05:00:00.000Z"),
    endDate: new Date("2021-02-19T06:15:00.000Z"),
    priority: 2
}, {
    text: "Distribute Training Material to Support Staff",
    ownerId: [2],
    startDate: new Date("2021-02-19T09:45:00.000Z"),
    endDate: new Date("2021-02-19T11:00:00.000Z"),
    priority: 1
}, {
    text: "Training Material Distribution Schedule",
    ownerId: [2],
    startDate: new Date("2021-02-19T11:15:00.000Z"),
    endDate: new Date("2021-02-19T13:15:00.000Z"),
    priority: 1
}, {
    text: "Approval on Converting to New HDMI Specification",
    ownerId: [4],
    startDate: new Date("2021-02-22T06:30:00.000Z"),
    endDate: new Date("2021-02-22T07:15:00.000Z"),
    priority: 2
}, {
    text: "Create New Spike for Automation Server",
    ownerId: [3],
    startDate: new Date("2021-02-22T07:00:00.000Z"),
    endDate: new Date("2021-02-22T09:30:00.000Z"),
    priority: 2
}, {
    text: "Code Review - New Automation Server",
    ownerId: [1],
    startDate: new Date("2021-02-22T10:00:00.000Z"),
    endDate: new Date("2021-02-22T12:00:00.000Z"),
    priority: 1
}, {
    text: "Confirm Availability for Sales Meeting",
    ownerId: [1],
    startDate: new Date("2021-02-23T07:15:00.000Z"),
    endDate: new Date("2021-02-23T12:15:00.000Z"),
    priority: 2
}, {
    text: "Reschedule Sales Team Meeting",
    ownerId: [2],
    startDate: new Date("2021-02-23T13:15:00.000Z"),
    endDate: new Date("2021-02-23T15:00:00.000Z"),
    priority: 2
}, {
    text: "Send 2 Remotes for Giveaways",
    ownerId: [3],
    startDate: new Date("2021-02-24T06:30:00.000Z"),
    endDate: new Date("2021-02-24T08:45:00.000Z"),
    priority: 1
}, {
    text: "Discuss Product Giveaways with Management",
    ownerId: [1],
    startDate: new Date("2021-02-24T09:15:00.000Z"),
    endDate: new Date("2021-02-24T13:45:00.000Z"),
    priority: 2
}, {
    text: "Replace Desktops on the 3rd Floor",
    ownerId: [2],
    startDate: new Date("2021-02-25T06:30:00.000Z"),
    endDate: new Date("2021-02-25T07:45:00.000Z"),
    priority: 1
}, {
    text: "Update Database with New Leads",
    ownerId: [3],
    startDate: new Date("2021-02-25T09:00:00.000Z"),
    endDate: new Date("2021-02-25T11:15:00.000Z"),
    priority: 2
}, {
    text: "Mail New Leads for Follow Up",
    ownerId: [1],
    startDate: new Date("2021-02-25T11:45:00.000Z"),
    endDate: new Date("2021-02-25T12:30:00.000Z"),
    priority: 2
}, {
    text: "Send Territory Sales Breakdown",
    ownerId: [2],
    startDate: new Date("2021-02-25T15:00:00.000Z"),
    endDate: new Date("2021-02-25T17:00:00.000Z"),
    priority: 1
}, {
    text: "Territory Sales Breakdown Report",
    ownerId: [1],
    startDate: new Date("2021-02-26T05:45:00.000Z"),
    endDate: new Date("2021-02-26T06:45:00.000Z"),
    priority: 1
}, {
    text: "Report on the State of Engineering Dept",
    ownerId: [3],
    startDate: new Date("2021-02-26T11:45:00.000Z"),
    endDate: new Date("2021-02-26T12:30:00.000Z"),
    priority: 2
}, {
    text: "Staff Productivity Report",
    ownerId: [4],
    startDate: new Date("2021-02-26T13:15:00.000Z"),
    endDate: new Date("2021-02-26T16:30:00.000Z"),
    priority: 2
}];