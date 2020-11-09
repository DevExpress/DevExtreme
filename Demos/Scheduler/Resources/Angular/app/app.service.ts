import { Injectable } from "@angular/core";

export class Appointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
    ownerId: number;
    roomId: number;
    priorityId: number;
}

export class Owner {
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
        ownerId: 4, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-24T16:30:00.000Z"),
        endDate: new Date("2021-05-24T18:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        ownerId: 2, roomId: 2, priorityId: 1,
        startDate: new Date("2021-05-24T19:00:00.000Z"),
        endDate: new Date("2021-05-24T20:00:00.000Z"),
        allDay: true
    }, {
        text: "Install New Router in Dev Room",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-24T21:30:00.000Z"),
        endDate: new Date("2021-05-24T22:30:00.000Z")
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        ownerId: 3, roomId: 2, priorityId: 2,
        startDate: new Date("2021-05-25T17:00:00.000Z"),
        endDate: new Date("2021-05-25T18:00:00.000Z")
    }, {
        text: "Final Budget Review",
        ownerId: 1, roomId: 1, priorityId: 1,
        startDate: new Date("2021-05-25T19:00:00.000Z"),
        endDate: new Date("2021-05-25T20:35:00.000Z")
    }, {
        text: "New Brochures",
        ownerId: 4, roomId: 3, priorityId: 2,
        startDate: new Date("2021-05-25T21:30:00.000Z"),
        endDate: new Date("2021-05-25T22:45:00.000Z")
    }, {
        text: "Install New Database",
        ownerId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-26T16:45:00.000Z"),
        endDate: new Date("2021-05-26T18:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        ownerId: 4, roomId: 2, priorityId: 1,
        startDate: new Date("2021-05-26T19:00:00.000Z"),
        endDate: new Date("2021-05-26T21:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        ownerId: 2, roomId: 2, priorityId: 2,
        startDate: new Date("2021-05-26T22:15:00.000Z"),
        endDate: new Date("2021-05-26T23:30:00.000Z")
    }, {
        text: "Customer Workshop",
        ownerId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T19:00:00.000Z"),
        allDay: true
    }, {
        text: "Prepare 2021 Marketing Plan",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-27T18:00:00.000Z"),
        endDate: new Date("2021-05-27T20:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        ownerId: 4, roomId: 1, priorityId: 1,
        startDate: new Date("2021-05-27T21:00:00.000Z"),
        endDate: new Date("2021-05-27T22:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        ownerId: 3, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-28T17:00:00.000Z"),
        endDate: new Date("2021-05-28T18:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        ownerId: 4, roomId: 2, priorityId: 2,
        startDate: new Date("2021-05-28T21:30:00.000Z"),
        endDate: new Date("2021-05-28T23:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        ownerId: 1, roomId: 1, priorityId: 2,
        startDate: new Date("2021-05-28T23:30:00.000Z"),
        endDate: new Date("2021-05-29T01:00:00.000Z")
    }, {
        text: "Launch New Website",
        ownerId: 2, roomId: 3, priorityId: 1,
        startDate: new Date("2021-05-28T19:20:00.000Z"),
        endDate: new Date("2021-05-28T21:00:00.000Z")
    }
];

let owners: Owner[] = [
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
        text: "High priority",
        id: 1,
        color: "#cc5c53"
    }, {
        text: "Low priority",
        id: 2,
        color: "#ff9747"
    }
];




@Injectable()
export class Service {
    getAppointments(): Appointment[] {
        return appointments;
    }

    getOwners(): Owner[] {
        return owners;
    }

    getRooms(): Room[] {
        return rooms;
    }

    getPriorities(): Priority[] {
        return priorities;
    }
}