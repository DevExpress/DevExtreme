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
    startDate: new Date("2021-02-01T16:00:00.000Z"),
    endDate: new Date("2021-02-01T17:30:00.000Z"),
    priority: 1
}, {
    text: "New Brochures",
    ownerId: [1],
    startDate: new Date("2021-02-01T18:30:00.000Z"),
    endDate: new Date("2021-02-01T21:15:00.000Z"),
    priority: 2
}, {
    text: "Brochure Design Review",
    ownerId: [4],
    startDate: new Date("2021-02-01T20:15:00.000Z"),
    endDate: new Date("2021-02-01T23:15:00.000Z"),
    priority: 1
}, {
    text: "Website Re-Design Plan",
    ownerId: [3],
    startDate: new Date("2021-02-01T23:45:00.000Z"),
    endDate: new Date("2021-02-02T18:15:00.000Z"),
    priority: 2
}, {
    text: "Rollout of New Website and Marketing Brochures",
    ownerId: [1],
    startDate: new Date("2021-02-02T15:15:00.000Z"),
    endDate: new Date("2021-02-02T17:45:00.000Z"),
    priority: 2
}, {
    text: "Update Sales Strategy Documents",
    ownerId: [2],
    startDate: new Date("2021-02-02T19:00:00.000Z"),
    endDate: new Date("2021-02-02T20:45:00.000Z"),
    priority: 1
}, {
    text: "Non-Compete Agreements",
    ownerId: [4],
    startDate: new Date("2021-02-03T15:15:00.000Z"),
    endDate: new Date("2021-02-03T16:00:00.000Z"),
    priority: 1
}, {
    text: "Approve Hiring of John Jeffers",
    ownerId: [2],
    startDate: new Date("2021-02-03T17:00:00.000Z"),
    endDate: new Date("2021-02-03T18:15:00.000Z"),
    priority: 2
}, {
    text: "Update NDA Agreement",
    ownerId: [1],
    startDate: new Date("2021-02-03T18:45:00.000Z"),
    endDate: new Date("2021-02-03T20:45:00.000Z"),
    priority: 2
}, {
    text: "Update Employee Files with New NDA",
    ownerId: [2],
    startDate: new Date("2021-02-03T21:00:00.000Z"),
    endDate: new Date("2021-02-03T23:45:00.000Z"),
    priority: 1
}, {
    text: "Submit Questions Regarding New NDA",
    ownerId: [1],
    startDate: new Date("2021-02-05T01:00:00.000Z"),
    endDate: new Date("2021-02-04T16:30:00.000Z"),
    priority: 1
}, {
    text: "Submit Signed NDA",
    ownerId: [2],
    startDate: new Date("2021-02-04T19:45:00.000Z"),
    endDate: new Date("2021-02-04T21:00:00.000Z"),
    priority: 1
}, {
    text: "Review Revenue Projections",
    ownerId: [3],
    startDate: new Date("2021-02-05T00:15:00.000Z"),
    endDate: new Date("2021-02-04T15:00:00.000Z"),
    priority: 2
}, {
    text: "Comment on Revenue Projections",
    ownerId: [2],
    startDate: new Date("2021-02-05T16:15:00.000Z"),
    endDate: new Date("2021-02-05T18:15:00.000Z"),
    priority: 1
}, {
    text: "Provide New Health Insurance Docs",
    ownerId: [3],
    startDate: new Date("2021-02-05T19:45:00.000Z"),
    endDate: new Date("2021-02-05T21:15:00.000Z"),
    priority: 2
}, {
    text: "Review Changes to Health Insurance Coverage",
    ownerId: [2],
    startDate: new Date("2021-02-05T21:15:00.000Z"),
    endDate: new Date("2021-02-05T22:30:00.000Z"),
    priority: 1
}, {
    text: "Review Training Course for any Ommissions",
    ownerId: [2],
    startDate: new Date("2021-02-08T21:00:00.000Z"),
    endDate: new Date("2021-02-09T19:00:00.000Z"),
    priority: 2
}, {
    text: "Recall Rebate Form",
    ownerId: [1],
    startDate: new Date("2021-02-08T19:45:00.000Z"),
    endDate: new Date("2021-02-08T20:15:00.000Z"),
    priority: 1
}, {
    text: "Create Report on Customer Feedback",
    ownerId: [4],
    startDate: new Date("2021-02-09T22:15:00.000Z"),
    endDate: new Date("2021-02-10T00:30:00.000Z"),
    priority: 2
}, {
    text: "Review Customer Feedback Report",
    ownerId: [2],
    startDate: new Date("2021-02-09T23:15:00.000Z"),
    endDate: new Date("2021-02-10T01:30:00.000Z"),
    priority: 1
}, {
    text: "Customer Feedback Report Analysis",
    ownerId: [3],
    startDate: new Date("2021-02-10T16:30:00.000Z"),
    endDate: new Date("2021-02-10T17:30:00.000Z"),
    priority: 1
}, {
    text: "Prepare Shipping Cost Analysis Report",
    ownerId: [4],
    startDate: new Date("2021-02-10T19:30:00.000Z"),
    endDate: new Date("2021-02-10T20:30:00.000Z"),
    priority: 1
}, {
    text: "Provide Feedback on Shippers",
    ownerId: [2],
    startDate: new Date("2021-02-10T21:15:00.000Z"),
    endDate: new Date("2021-02-10T23:00:00.000Z"),
    priority: 2
}, {
    text: "Select Preferred Shipper",
    ownerId: [1],
    startDate: new Date("2021-02-11T00:30:00.000Z"),
    endDate: new Date("2021-02-11T03:00:00.000Z"),
    priority: 1
}, {
    text: "Complete Shipper Selection Form",
    ownerId: [2],
    startDate: new Date("2021-02-11T15:30:00.000Z"),
    endDate: new Date("2021-02-11T17:00:00.000Z"),
    priority: 2
}, {
    text: "Upgrade Server Hardware",
    ownerId: [4],
    startDate: new Date("2021-02-11T19:00:00.000Z"),
    endDate: new Date("2021-02-11T21:15:00.000Z"),
    priority: 1
}, {
    text: "Upgrade Personal Computers",
    ownerId: [3],
    startDate: new Date("2021-02-11T21:45:00.000Z"),
    endDate: new Date("2021-02-11T23:30:00.000Z"),
    priority: 1
}, {
    text: "Upgrade Apps to Windows RT or stay with WinForms",
    ownerId: [1],
    startDate: new Date("2021-02-12T17:30:00.000Z"),
    endDate: new Date("2021-02-12T20:00:00.000Z"),
    priority: 1
}, {
    text: "Estimate Time Required to Touch-Enable Apps",
    ownerId: [1],
    startDate: new Date("2021-02-12T21:45:00.000Z"),
    endDate: new Date("2021-02-12T23:30:00.000Z"),
    priority: 1
}, {
    text: "Report on Tranistion to Touch-Based Apps",
    ownerId: [2],
    startDate: new Date("2021-02-13T01:30:00.000Z"),
    endDate: new Date("2021-02-13T02:00:00.000Z"),
    priority: 1
}, {
    text: "Submit New Website Design",
    ownerId: [2],
    startDate: new Date("2021-02-15T15:00:00.000Z"),
    endDate: new Date("2021-02-15T17:00:00.000Z"),
    priority: 2
}, {
    text: "Create Icons for Website",
    ownerId: [4],
    startDate: new Date("2021-02-15T18:30:00.000Z"),
    endDate: new Date("2021-02-15T20:15:00.000Z"),
    priority: 1
}, {
    text: "Create New Product Pages",
    ownerId: [1],
    startDate: new Date("2021-02-16T16:45:00.000Z"),
    endDate: new Date("2021-02-16T18:45:00.000Z"),
    priority: 2
}, {
    text: "Approve Website Launch",
    ownerId: [3],
    startDate: new Date("2021-02-16T19:00:00.000Z"),
    endDate: new Date("2021-02-16T22:15:00.000Z"),
    priority: 1
}, {
    text: "Update Customer Shipping Profiles",
    ownerId: [3],
    startDate: new Date("2021-02-17T16:30:00.000Z"),
    endDate: new Date("2021-02-17T18:00:00.000Z"),
    priority: 1
}, {
    text: "Create New Shipping Return Labels",
    ownerId: [4],
    startDate: new Date("2021-02-17T19:45:00.000Z"),
    endDate: new Date("2021-02-17T21:00:00.000Z"),
    priority: 1
}, {
    text: "Get Design for Shipping Return Labels",
    ownerId: [3],
    startDate: new Date("2021-02-17T22:00:00.000Z"),
    endDate: new Date("2021-02-17T23:30:00.000Z"),
    priority: 1
}, {
    text: "PSD needed for Shipping Return Labels",
    ownerId: [4],
    startDate: new Date("2021-02-18T15:30:00.000Z"),
    endDate: new Date("2021-02-18T16:15:00.000Z"),
    priority: 2
}, {
    text: "Contact ISP and Discuss Payment Options",
    ownerId: [1],
    startDate: new Date("2021-02-18T18:30:00.000Z"),
    endDate: new Date("2021-02-18T23:00:00.000Z"),
    priority: 2
}, {
    text: "Prepare Year-End Support Summary Report",
    ownerId: [2],
    startDate: new Date("2021-02-19T00:00:00.000Z"),
    endDate: new Date("2021-02-19T03:00:00.000Z"),
    priority: 1
}, {
    text: "Review New Training Material",
    ownerId: [3],
    startDate: new Date("2021-02-19T15:00:00.000Z"),
    endDate: new Date("2021-02-19T16:15:00.000Z"),
    priority: 2
}, {
    text: "Distribute Training Material to Support Staff",
    ownerId: [2],
    startDate: new Date("2021-02-19T19:45:00.000Z"),
    endDate: new Date("2021-02-19T21:00:00.000Z"),
    priority: 1
}, {
    text: "Training Material Distribution Schedule",
    ownerId: [2],
    startDate: new Date("2021-02-19T21:15:00.000Z"),
    endDate: new Date("2021-02-19T23:15:00.000Z"),
    priority: 1
}, {
    text: "Approval on Converting to New HDMI Specification",
    ownerId: [4],
    startDate: new Date("2021-02-22T16:30:00.000Z"),
    endDate: new Date("2021-02-22T17:15:00.000Z"),
    priority: 2
}, {
    text: "Create New Spike for Automation Server",
    ownerId: [3],
    startDate: new Date("2021-02-22T17:00:00.000Z"),
    endDate: new Date("2021-02-22T19:30:00.000Z"),
    priority: 2
}, {
    text: "Code Review - New Automation Server",
    ownerId: [1],
    startDate: new Date("2021-02-22T20:00:00.000Z"),
    endDate: new Date("2021-02-22T22:00:00.000Z"),
    priority: 1
}, {
    text: "Confirm Availability for Sales Meeting",
    ownerId: [1],
    startDate: new Date("2021-02-23T17:15:00.000Z"),
    endDate: new Date("2021-02-23T22:15:00.000Z"),
    priority: 2
}, {
    text: "Reschedule Sales Team Meeting",
    ownerId: [2],
    startDate: new Date("2021-02-23T23:15:00.000Z"),
    endDate: new Date("2021-02-24T01:00:00.000Z"),
    priority: 2
}, {
    text: "Send 2 Remotes for Giveaways",
    ownerId: [3],
    startDate: new Date("2021-02-24T16:30:00.000Z"),
    endDate: new Date("2021-02-24T18:45:00.000Z"),
    priority: 1
}, {
    text: "Discuss Product Giveaways with Management",
    ownerId: [1],
    startDate: new Date("2021-02-24T19:15:00.000Z"),
    endDate: new Date("2021-02-24T23:45:00.000Z"),
    priority: 2
}, {
    text: "Replace Desktops on the 3rd Floor",
    ownerId: [2],
    startDate: new Date("2021-02-25T16:30:00.000Z"),
    endDate: new Date("2021-02-25T17:45:00.000Z"),
    priority: 1
}, {
    text: "Update Database with New Leads",
    ownerId: [3],
    startDate: new Date("2021-02-25T19:00:00.000Z"),
    endDate: new Date("2021-02-25T21:15:00.000Z"),
    priority: 2
}, {
    text: "Mail New Leads for Follow Up",
    ownerId: [1],
    startDate: new Date("2021-02-25T21:45:00.000Z"),
    endDate: new Date("2021-02-25T22:30:00.000Z"),
    priority: 2
}, {
    text: "Send Territory Sales Breakdown",
    ownerId: [2],
    startDate: new Date("2021-02-26T01:00:00.000Z"),
    endDate: new Date("2021-02-26T03:00:00.000Z"),
    priority: 1
}, {
    text: "Territory Sales Breakdown Report",
    ownerId: [1],
    startDate: new Date("2021-02-26T15:45:00.000Z"),
    endDate: new Date("2021-02-26T16:45:00.000Z"),
    priority: 1
}, {
    text: "Report on the State of Engineering Dept",
    ownerId: [3],
    startDate: new Date("2021-02-26T21:45:00.000Z"),
    endDate: new Date("2021-02-26T22:30:00.000Z"),
    priority: 2
}, {
    text: "Staff Productivity Report",
    ownerId: [4],
    startDate: new Date("2021-02-26T23:15:00.000Z"),
    endDate: new Date("2021-02-27T02:30:00.000Z"),
    priority: 2
}];