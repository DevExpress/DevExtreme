import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
    assigneeId: number;
    roomId: number;
    priorityId: number;
}

export class Assignee {
    text: string;
    id: number;
    color: string;
}

export class Room {
    text: string;
    id: number;
    color: string;
}

export class Priority {
    text: string;
    id: number;
    color: string;
}

let appointments: Appointment[] = [
    {
        text: "Website Re-Design Plan",
        assigneeId: 4, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-26T16:30:00.000Z"),
        endDate: new Date("2021-04-26T18:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        assigneeId: 2, roomId: 2, priorityId: 1,
        startDate: new Date("2021-04-26T19:00:00.000Z"),
        endDate: new Date("2021-04-26T20:00:00.000Z"),
        allDay: true
    }, {
        text: "Install New Router in Dev Room",
        assigneeId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-26T21:30:00.000Z"),
        endDate: new Date("2021-04-26T22:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        assigneeId: 3, roomId: 2, priorityId: 2,
        startDate: new Date("2021-04-27T17:00:00.000Z"),
        endDate: new Date("2021-04-27T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        assigneeId: 1, roomId: 1, priorityId: 1,
        startDate: new Date("2021-04-27T19:00:00.000Z"),
        endDate: new Date("2021-04-27T20:35:00.000Z")
    }, {
        text: "New Brochures",
        assigneeId: 4, roomId: 3, priorityId: 2,
        startDate: new Date("2021-04-27T21:30:00.000Z"),
        endDate: new Date("2021-04-27T22:45:00.000Z")
    }, {
        text: "Install New Database",
        assigneeId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-28T16:45:00.000Z"),
        endDate: new Date("2021-04-28T18:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        assigneeId: 4, roomId: 2, priorityId: 1,
        startDate: new Date("2021-04-28T19:00:00.000Z"),
        endDate: new Date("2021-04-28T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        assigneeId: 2, roomId: 2, priorityId: 2,
        startDate: new Date("2021-04-28T22:15:00.000Z"),
        endDate: new Date("2021-04-28T23:30:00.000Z")
    }, {
        text: "Customer Workshop",
        assigneeId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-29T18:00:00.000Z"),
        endDate: new Date("2021-04-29T19:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        assigneeId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-29T18:00:00.000Z"),
        endDate: new Date("2021-04-29T20:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        assigneeId: 4, roomId: 1, priorityId: 1,
        startDate: new Date("2021-04-29T21:00:00.000Z"),
        endDate: new Date("2021-04-29T22:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        assigneeId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-30T17:00:00.000Z"),
        endDate: new Date("2021-04-30T18:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        assigneeId: 4, roomId: 2, priorityId: 2,
        startDate: new Date("2021-04-30T21:30:00.000Z"),
        endDate: new Date("2021-04-30T23:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        assigneeId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-04-30T23:30:00.000Z"),
        endDate: new Date("2021-05-01T01:00:00.000Z")
    }, {
        text: "Launch New Website",
        assigneeId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-04-30T19:20:00.000Z"),
        endDate: new Date("2021-04-30T21:00:00.000Z")
    }
];

let assignees: Assignee[] = [
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

let rooms: Room[] = [
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

let priorities: Priority[] = [
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




@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }

    getAssignees(): Assignee[] {
        return assignees;
    }

    getRooms(): Room[] {
        return rooms;
    }

    getPriorities(): Priority[] {
        return priorities;
    }
}