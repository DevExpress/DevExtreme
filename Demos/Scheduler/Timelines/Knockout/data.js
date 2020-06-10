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
    "text": "Google AdWords Strategy",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 1, 9, 0),
    "endDate": new Date(2017, 4, 1, 10, 30),
    "priority": 1
}, {
    "text": "New Brochures",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 1, 11, 30),
    "endDate": new Date(2017, 4, 1, 14, 15),
    "priority": 2
}, {
    "text": "Brochure Design Review",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 1, 13, 15),
    "endDate": new Date(2017, 4, 1, 16, 15),
    "priority": 1
}, {
    "text": "Website Re-Design Plan",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 1, 16, 45),
    "endDate": new Date(2017, 4, 2, 11, 15),
    "priority": 2
}, {
    "text": "Rollout of New Website and Marketing Brochures",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 2, 8, 15),
    "endDate": new Date(2017, 4, 2, 10, 45),
    "priority": 2
}, {
    "text": "Update Sales Strategy Documents",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 2, 12, 0),
    "endDate": new Date(2017, 4, 2, 13, 45),
    "priority": 1
}, {
    "text": "Non-Compete Agreements",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 3, 8, 15),
    "endDate": new Date(2017, 4, 3, 9, 0),
    "priority": 1
}, {
    "text": "Approve Hiring of John Jeffers",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 3, 10, 0),
    "endDate": new Date(2017, 4, 3, 11, 15),
    "priority": 2
}, {
    "text": "Update NDA Agreement",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 3, 11, 45),
    "endDate": new Date(2017, 4, 3, 13, 45),
    "priority": 2
}, {
    "text": "Update Employee Files with New NDA",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 3, 14, 0),
    "endDate": new Date(2017, 4, 3, 16, 45),
    "priority": 1
}, {
    "text": "Submit Questions Regarding New NDA",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 4, 8, 0),
    "endDate": new Date(2017, 4, 4, 9, 30),
    "priority": 1
}, {
    "text": "Submit Signed NDA",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 4, 12, 45),
    "endDate": new Date(2017, 4, 4, 14, 0),
    "priority": 1
}, {
    "text": "Review Revenue Projections",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 4, 17, 15),
    "endDate": new Date(2017, 4, 4, 18, 0),
    "priority": 2
}, {
    "text": "Comment on Revenue Projections",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 5, 9, 15),
    "endDate": new Date(2017, 4, 5, 11, 15),
    "priority": 1
}, {
    "text": "Provide New Health Insurance Docs",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 5, 12, 45),
    "endDate": new Date(2017, 4, 5, 14, 15),
    "priority": 2
}, {
    "text": "Review Changes to Health Insurance Coverage",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 5, 14, 15),
    "endDate": new Date(2017, 4, 5, 15, 30),
    "priority": 1
}, {
    "text": "Review Training Course for any Ommissions",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 8, 14, 0),
    "endDate": new Date(2017, 4, 9, 12, 0),
    "priority": 2
}, {
    "text": "Recall Rebate Form",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 8, 12, 45),
    "endDate": new Date(2017, 4, 8, 13, 15),
    "priority": 1
}, {
    "text": "Create Report on Customer Feedback",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 9, 15, 15),
    "endDate": new Date(2017, 4, 9, 17, 30),
    "priority": 2
}, {
    "text": "Review Customer Feedback Report",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 9, 16, 15),
    "endDate": new Date(2017, 4, 9, 18, 30),
    "priority": 1
}, {
    "text": "Customer Feedback Report Analysis",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 10, 9, 30),
    "endDate": new Date(2017, 4, 10, 10, 30),
    "priority": 1
}, {
    "text": "Prepare Shipping Cost Analysis Report",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 10, 12, 30),
    "endDate": new Date(2017, 4, 10, 13, 30),
    "priority": 1
}, {
    "text": "Provide Feedback on Shippers",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 10, 14, 15),
    "endDate": new Date(2017, 4, 10, 16, 0),
    "priority": 2
}, {
    "text": "Select Preferred Shipper",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 10, 17, 30),
    "endDate": new Date(2017, 4, 10, 20, 0),
    "priority": 1
}, {
    "text": "Complete Shipper Selection Form",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 11, 8, 30),
    "endDate": new Date(2017, 4, 11, 10, 0),
    "priority": 2
}, {
    "text": "Upgrade Server Hardware",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 11, 12, 0),
    "endDate": new Date(2017, 4, 11, 14, 15),
    "priority": 1
}, {
    "text": "Upgrade Personal Computers",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 11, 14, 45),
    "endDate": new Date(2017, 4, 11, 16, 30),
    "priority": 1
}, {
    "text": "Upgrade Apps to Windows RT or stay with WinForms",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 12, 10, 30),
    "endDate": new Date(2017, 4, 12, 13, 0),
    "priority": 1
}, {
    "text": "Estimate Time Required to Touch-Enable Apps",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 12, 14, 45),
    "endDate": new Date(2017, 4, 12, 16, 30),
    "priority": 1
}, {
    "text": "Report on Tranistion to Touch-Based Apps",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 12, 18, 30),
    "endDate": new Date(2017, 4, 12, 19, 0),
    "priority": 1
}, {
    "text": "Submit New Website Design",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 15, 8, 0),
    "endDate": new Date(2017, 4, 15, 10, 0),
    "priority": 2
}, {
    "text": "Create Icons for Website",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 15, 11, 30),
    "endDate": new Date(2017, 4, 15, 13, 15),
    "priority": 1
}, {
    "text": "Create New Product Pages",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 16, 9, 45),
    "endDate": new Date(2017, 4, 16, 11, 45),
    "priority": 2
}, {
    "text": "Approve Website Launch",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 16, 12, 0),
    "endDate": new Date(2017, 4, 16, 15, 15),
    "priority": 1
}, {
    "text": "Update Customer Shipping Profiles",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 17, 9, 30),
    "endDate": new Date(2017, 4, 17, 11, 0),
    "priority": 1
}, {
    "text": "Create New Shipping Return Labels",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 17, 12, 45),
    "endDate": new Date(2017, 4, 17, 14, 0),
    "priority": 1
}, {
    "text": "Get Design for Shipping Return Labels",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 17, 15, 0),
    "endDate": new Date(2017, 4, 17, 16, 30),
    "priority": 1
}, {
    "text": "PSD needed for Shipping Return Labels",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 18, 8, 30),
    "endDate": new Date(2017, 4, 18, 9, 15),
    "priority": 2
}, {
    "text": "Contact ISP and Discuss Payment Options",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 18, 11, 30),
    "endDate": new Date(2017, 4, 18, 16, 0),
    "priority": 2
}, {
    "text": "Prepare Year-End Support Summary Report",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 18, 17, 0),
    "endDate": new Date(2017, 4, 18, 20, 0),
    "priority": 1
}, {
    "text": "Review New Training Material",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 19, 8, 0),
    "endDate": new Date(2017, 4, 19, 9, 15),
    "priority": 2
}, {
    "text": "Distribute Training Material to Support Staff",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 19, 12, 45),
    "endDate": new Date(2017, 4, 19, 14, 0),
    "priority": 1
}, {
    "text": "Training Material Distribution Schedule",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 19, 14, 15),
    "endDate": new Date(2017, 4, 19, 16, 15),
    "priority": 1
}, {
    "text": "Approval on Converting to New HDMI Specification",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 22, 9, 30),
    "endDate": new Date(2017, 4, 22, 10, 15),
    "priority": 2
}, {
    "text": "Create New Spike for Automation Server",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 22, 10, 0),
    "endDate": new Date(2017, 4, 22, 12, 30),
    "priority": 2
}, {
    "text": "Code Review - New Automation Server",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 22, 13, 0),
    "endDate": new Date(2017, 4, 22, 15, 0),
    "priority": 1
}, {
    "text": "Confirm Availability for Sales Meeting",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 23, 10, 15),
    "endDate": new Date(2017, 4, 23, 15, 15),
    "priority": 2
}, {
    "text": "Reschedule Sales Team Meeting",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 23, 16, 15),
    "endDate": new Date(2017, 4, 23, 18, 0),
    "priority": 2
}, {
    "text": "Send 2 Remotes for Giveaways",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 24, 9, 30),
    "endDate": new Date(2017, 4, 24, 11, 45),
    "priority": 1
}, {
    "text": "Discuss Product Giveaways with Management",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 24, 12, 15),
    "endDate": new Date(2017, 4, 24, 16, 45),
    "priority": 2
}, {
    "text": "Replace Desktops on the 3rd Floor",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 25, 9, 30),
    "endDate": new Date(2017, 4, 25, 10, 45),
    "priority": 1
}, {
    "text": "Update Database with New Leads",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 25, 12, 0),
    "endDate": new Date(2017, 4, 25, 14, 15),
    "priority": 2
}, {
    "text": "Mail New Leads for Follow Up",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 25, 14, 45),
    "endDate": new Date(2017, 4, 25, 15, 30),
    "priority": 2
}, {
    "text": "Send Territory Sales Breakdown",
    "ownerId": [2],
    "startDate": new Date(2017, 4, 25, 18, 0),
    "endDate": new Date(2017, 4, 25, 20, 0),
    "priority": 1
}, {
    "text": "Territory Sales Breakdown Report",
    "ownerId": [1],
    "startDate": new Date(2017, 4, 26, 8, 45),
    "endDate": new Date(2017, 4, 26, 9, 45),
    "priority": 1
}, {
    "text": "Report on the State of Engineering Dept",
    "ownerId": [3],
    "startDate": new Date(2017, 4, 26, 14, 45),
    "endDate": new Date(2017, 4, 26, 15, 30),
    "priority": 2
}, {
    "text": "Staff Productivity Report",
    "ownerId": [4],
    "startDate": new Date(2017, 4, 26, 16, 15),
    "endDate": new Date(2017, 4, 26, 19, 30),
    "priority": 2
}];