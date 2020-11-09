var data = [{
        text: "Walking a dog",
        priorityId: 1,
        typeId: 1,
        startDate: new Date("2021-05-24T15:00:00.000Z"),
        endDate: new Date("2021-05-24T15:30:00.000Z"),
        recurrenceRule: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20210530"
    },
    {
        text: "Website Re-Design Plan",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-24T16:00:00.000Z"),
        endDate: new Date("2021-05-24T18:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-24T19:00:00.000Z"),
        endDate: new Date("2021-05-24T20:00:00.000Z")
    }, {
        text: "Install New Router in Dev Room",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-24T21:30:00.000Z"),
        endDate: new Date("2021-05-24T22:30:00.000Z")
    }, {
        text: "Go Grocery Shopping",
        priorityId: 1,
        typeId: 1,
        startDate: new Date("2021-05-25T01:30:00.000Z"),
        endDate: new Date("2021-05-25T02:30:00.000Z"),
        recurrenceRule: "FREQ=DAILY;BYDAY=MO,WE,FR;UNTIL=20210530"
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-25T17:00:00.000Z"),
        endDate: new Date("2021-05-25T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-25T19:00:00.000Z"),
        endDate: new Date("2021-05-25T20:35:00.000Z")
    }, {
        text: "New Brochures",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-25T21:30:00.000Z"),
        endDate: new Date("2021-05-25T22:45:00.000Z")
    }, {
        text: "Install New Database",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-26T16:45:00.000Z"),
        endDate: new Date("2021-05-26T18:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-26T19:00:00.000Z"),
        endDate: new Date("2021-05-26T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-26T22:15:00.000Z"),
        endDate: new Date("2021-05-26T23:30:00.000Z")
    }, {
        text: "Prepare 2021 Marketing Plan",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T20:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-27T21:00:00.000Z"),
        endDate: new Date("2021-05-27T22:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-28T17:00:00.000Z"),
        endDate: new Date("2021-05-28T18:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-28T21:30:00.000Z"),
        endDate: new Date("2021-05-28T23:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-28T23:30:00.000Z"),
        endDate: new Date("2021-05-29T01:00:00.000Z")
    }, {
        text: "Launch New Website",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-28T19:20:00.000Z"),
        endDate: new Date("2021-05-28T21:00:00.000Z")
    }, {
        text: "Visiting a Doctor",
        priorityId: 2,
        typeId: 1,
        startDate: new Date("2021-05-29T17:00:00.000Z"),
        endDate: new Date("2021-05-29T20:30:00.000Z")
    }
];


var priorityData = [{
        text: "Low Priority",
        id: 1,
        color: "#fcb65e"
    }, {
        text: "High Priority",
        id: 2,
        color: "#e18e92"
    }
];

var typeData = [{
        text: "Home",
        id: 1,
        color: "#b6d623"
    }, {
        text: "Work",
        id: 2,
        color: "#679ec5"
    }
];