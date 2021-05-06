var data = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date("2021-03-01T16:30:00.000Z"),
        endDate: new Date("2021-03-01T18:30:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,FR;WKST=TU;INTERVAL=2;COUNT=32",
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date("2021-03-01T16:30:00.000Z"),
        endDate: new Date("2021-03-01T18:30:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,FR;INTERVAL=4;COUNT=32",
        allDay: true,
        priorityId: [1]
    }, {
        text: "Install New Router in Dev Room",
        startDate: new Date("2021-03-01T16:30:00.000Z"),
        endDate: new Date("2021-03-01T18:30:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=FR;INTERVAL=2;COUNT=32"
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-02-10T17:00:00.000Z"),
        endDate: new Date("2021-02-10T18:00:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=WE;INTERVAL=2;COUNT=32",
        priorityId: [2]
    }, {
        text: "Final Budget Review",
        startDate: new Date("2021-04-01T19:00:00.000Z"),
        endDate: new Date("2021-04-01T20:35:00.000Z")
    }, {
        text: "New Brochures",
        startDate: new Date("2021-04-01T21:30:00.000Z"),
        endDate: new Date("2021-04-01T22:45:00.000Z")
    }, {
        text: "Install New Database",
        startDate: new Date("2021-04-01T16:45:00.000Z"),
        endDate: new Date("2021-04-01T18:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-04-01T19:00:00.000Z"),
        endDate: new Date("2021-04-01T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-04-01T22:15:00.000Z"),
        endDate: new Date("2021-04-01T23:30:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-04-02T22:15:00.000Z"),
        endDate: new Date("2021-04-02T23:30:00.000Z")
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
