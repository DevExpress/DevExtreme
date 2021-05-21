var resourcesList = ["Owner", "Room", "Priority"],
    data = [
    {
        text: "Website Re-Design Plan",
        ownerId: 4, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-26T16:30:00.000Z"),
        endDate: new Date("2021-04-26T18:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        ownerId: 2, roomId: 2, priorityId: 1,
        startDate: new Date("2021-04-26T19:00:00.000Z"),
        endDate: new Date("2021-04-26T20:00:00.000Z"),
        allDay: true
    }, {
        text: "Install New Router in Dev Room",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-26T21:30:00.000Z"),
        endDate: new Date("2021-04-26T22:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        ownerId: 3, roomId: 2, priorityId: 2,
        startDate: new Date("2021-04-27T17:00:00.000Z"),
        endDate: new Date("2021-04-27T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        ownerId: 1, roomId: 1, priorityId: 1,
        startDate: new Date("2021-04-27T19:00:00.000Z"),
        endDate: new Date("2021-04-27T20:35:00.000Z")
    }, {
        text: "New Brochures",
        ownerId: 4, roomId: 3, priorityId: 2,
        startDate: new Date("2021-04-27T21:30:00.000Z"),
        endDate: new Date("2021-04-27T22:45:00.000Z")
    }, {
        text: "Install New Database",
        ownerId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-28T16:45:00.000Z"),
        endDate: new Date("2021-04-28T18:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        ownerId: 4, roomId: 2, priorityId: 1,
        startDate: new Date("2021-04-28T19:00:00.000Z"),
        endDate: new Date("2021-04-28T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        ownerId: 2, roomId: 2, priorityId: 2,
        startDate: new Date("2021-04-28T22:15:00.000Z"),
        endDate: new Date("2021-04-28T23:30:00.000Z")
    }, {
        text: "Customer Workshop",
        ownerId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-29T18:00:00.000Z"),
        endDate: new Date("2021-04-29T19:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-29T18:00:00.000Z"),
        endDate: new Date("2021-04-29T20:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        ownerId: 4, roomId: 1, priorityId: 1,
        startDate: new Date("2021-04-29T21:00:00.000Z"),
        endDate: new Date("2021-04-29T22:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        ownerId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-30T17:00:00.000Z"),
        endDate: new Date("2021-04-30T18:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        ownerId: 4, roomId: 2, priorityId: 2,
        startDate: new Date("2021-04-30T21:30:00.000Z"),
        endDate: new Date("2021-04-30T23:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-30T23:30:00.000Z"),
        endDate: new Date("2021-05-01T01:00:00.000Z")
    }, {
        text: "Launch New Website",
        ownerId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-30T19:20:00.000Z"),
        endDate: new Date("2021-04-30T21:00:00.000Z")
    }
];

var owners = [
    {
        text: "Samantha Bright",
        id: 1,
        color: "#727bd2"
    }, {
        text: "John Heart",
        id: 2,
        color: "#32c9ed"
    }, {
        text: "Todd Hoffman",
        id: 3,
        color: "#2a7ee4"
    }, {
        text: "Sandra Johnson",
        id: 4,
        color: "#7b49d3"
    }
];

var rooms = [
    {
        text: "Room 1",
        id: 1,
        color: "#00af2c"
    }, {
        text: "Room 2",
        id: 2,
        color: "#56ca85"
    }, {
        text: "Room 3",
        id: 3,
        color: "#8ecd3c"
    }
];

var priorities = [
    {
        text: "High",
        id: 1,
        color: "#cc5c53"
    }, {
        text: "Low",
        id: 2,
        color: "#ff9747"
    }
];


