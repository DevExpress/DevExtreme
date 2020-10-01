var resourcesList = ["Owner", "Room", "Priority"],
    data = [
    {
        text: "Website Re-Design Plan",
        ownerId: 4, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-24T06:30:00.000Z"),
        endDate: new Date("2021-05-24T08:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        ownerId: 2, roomId: 2, priorityId: 1,
        startDate: new Date("2021-05-24T09:00:00.000Z"),
        endDate: new Date("2021-05-24T10:00:00.000Z"),
        allDay: true
    }, {
        text: "Install New Router in Dev Room",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-24T11:30:00.000Z"),
        endDate: new Date("2021-05-24T12:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        ownerId: 3, roomId: 2, priorityId: 2,
        startDate: new Date("2021-05-25T07:00:00.000Z"),
        endDate: new Date("2021-05-25T08:00:00.000Z")
    }, {
        text: "Final Budget Review",
        ownerId: 1, roomId: 1, priorityId: 1,
        startDate: new Date("2021-05-25T09:00:00.000Z"),
        endDate: new Date("2021-05-25T10:35:00.000Z")
    }, {
        text: "New Brochures",
        ownerId: 4, roomId: 3, priorityId: 2,
        startDate: new Date("2021-05-25T11:30:00.000Z"),
        endDate: new Date("2021-05-25T12:45:00.000Z")
    }, {
        text: "Install New Database",
        ownerId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-26T06:45:00.000Z"),
        endDate: new Date("2021-05-26T08:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        ownerId: 4, roomId: 2, priorityId: 1,
        startDate: new Date("2021-05-26T09:00:00.000Z"),
        endDate: new Date("2021-05-26T11:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        ownerId: 2, roomId: 2, priorityId: 2,
        startDate: new Date("2021-05-26T12:15:00.000Z"),
        endDate: new Date("2021-05-26T13:30:00.000Z")
    }, {
        text: "Customer Workshop",
        ownerId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-27T08:00:00.000Z"),
        endDate: new Date("2021-05-27T09:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-27T08:00:00.000Z"),
        endDate: new Date("2021-05-27T10:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        ownerId: 4, roomId: 1, priorityId: 1,
        startDate: new Date("2021-05-27T11:00:00.000Z"),
        endDate: new Date("2021-05-27T12:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        ownerId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-28T07:00:00.000Z"),
        endDate: new Date("2021-05-28T08:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        ownerId: 4, roomId: 2, priorityId: 2,
        startDate: new Date("2021-05-28T11:30:00.000Z"),
        endDate: new Date("2021-05-28T13:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-28T13:30:00.000Z"),
        endDate: new Date("2021-05-28T15:00:00.000Z")
    }, {
        text: "Launch New Website",
        ownerId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-28T09:20:00.000Z"),
        endDate: new Date("2021-05-28T11:00:00.000Z")
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
        text: "High priority",
        id: 1,
        color: "#cc5c53"
    }, {
        text: "Low priority",
        id: 2,
        color: "#ff9747"
    }
];


