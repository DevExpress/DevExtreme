var data = [
    {
        text: "Watercolor Landscape",
        roomId: [1],
        startDate: new Date("2021-02-29T06:30:00.000Z"),
        endDate: new Date("2021-02-29T08:00:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=TU,FR;COUNT=10"
    }, {
        text: "Oil Painting for Beginners",
        roomId: [2],
        startDate: new Date("2021-02-29T06:30:00.000Z"),
        endDate: new Date("2021-02-29T08:00:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10"
    }, {
        text: "Testing",
        roomId: [3],
        startDate: new Date("2021-02-29T09:00:00.000Z"),
        endDate: new Date("2021-02-29T10:00:00.000Z"),
        recurrenceRule: "FREQ=WEEKLY;BYDAY=MO;WKST=TU;INTERVAL=2;COUNT=2"
    }, {
        text: "Meeting of Instructors",
        roomId: [4],
        startDate: new Date("2021-02-29T06:00:00.000Z"),
        endDate: new Date("2021-02-29T06:15:00.000Z"),
        recurrenceRule: "FREQ=DAILY;BYDAY=WE;UNTIL=20210401"
    }, {
        text: "Recruiting students",
        roomId: [5],
        startDate: new Date("2021-02-24T07:00:00.000Z"),
        endDate: new Date("2021-02-24T08:00:00.000Z"),
        recurrenceRule: "FREQ=YEARLY;BYWEEKNO=14",
        recurrenceException: "20210411T100000"
    }, {
        text: "Final exams",
        roomId: [3],
        startDate: new Date("2021-02-24T09:00:00.000Z"),
        endDate: new Date("2021-02-24T10:35:00.000Z"),
        recurrenceRule: "FREQ=YEARLY;BYWEEKNO=15;BYDAY=TH,FR"
    }, {
        text: "Monthly Planning",
        roomId: [4],
        startDate: new Date("2021-03-24T11:30:00.000Z"),
        endDate: new Date("2021-03-24T12:45:00.000Z"),
        recurrenceRule: "FREQ=MONTHLY;BYMONTHDAY=27;COUNT=1"
    }, {
        text: "Open Day",
        roomId: [5],
        startDate: new Date("2021-02-29T06:30:00.000Z"),
        endDate: new Date("2021-02-29T10:00:00.000Z"),
        recurrenceRule: "FREQ=YEARLY;BYYEARDAY=87"
    }
];

var resourcesData = [
    {
        text: "Room 101",
        id: 1,
        color: "#bbd806"
    }, {
        text: "Room 102",
        id: 2,
        color: "#f34c8a"
    }, {
        text: "Room 103",
        id: 3,
        color: "#ae7fcc"
    }, {
        text: "Meeting room",
        id: 4,
        color: "#ff8817"
    }, {
        text: "Conference hall",
        id: 5,
        color: "#03bb92"
    }
];