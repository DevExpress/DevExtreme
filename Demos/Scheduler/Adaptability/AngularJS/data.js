var data = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11, 30),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,FR;WKST=TU;INTERVAL=2;COUNT=32",
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11, 30),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,FR;INTERVAL=4;COUNT=32",
        allDay: true,
        priorityId: [1]
    }, {
        text: "Install New Router in Dev Room",
        startDate: new Date(2017, 4, 1, 9, 30),
        endDate: new Date(2017, 4, 1, 11, 30),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=FR;INTERVAL=2;COUNT=32"
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date(2017, 4, 10, 10, 0),
        endDate: new Date(2017, 4, 10, 11, 0),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=WE;INTERVAL=2;COUNT=32",
        priorityId: [2]
    }, {
        text: "Final Budget Review",
        startDate: new Date(2017, 4, 25, 12, 0),
        endDate: new Date(2017, 4, 25, 13, 35)
    }, {
        text: "New Brochures",
        startDate: new Date(2017, 4, 25, 14, 30),
        endDate: new Date(2017, 4, 25, 15, 45)
    }, {
        text: "Install New Database",
        startDate: new Date(2017, 4, 25, 9, 45),
        endDate: new Date(2017, 4, 25, 11, 15)
    }, {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date(2017, 4, 25, 12, 0),
        endDate: new Date(2017, 4, 25, 14, 0)
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date(2017, 4, 25, 15, 15),
        endDate: new Date(2017, 4, 25, 16, 30)
    }, {
        text: "Upgrade Personal Computers",
        startDate: new Date(2017, 4, 26, 15, 15),
        endDate: new Date(2017, 4, 26, 16, 30)
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