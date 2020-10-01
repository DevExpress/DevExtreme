import { Injectable } from '@angular/core';

export class Data {
    text: string;
    priorityId: number;
	typeId: number;
    startDate: Date;
    endDate: Date;
	recurrenceRule?: string;
}

export class PriorityData {
    text: string;
    id: number;
	color: string;
}

export class TypeData {
    text: string;
    id: number;
	color: string;
}

let data: Data[] = [{
        text: "Walking a dog",
        priorityId: 1,
        typeId: 1,
        startDate: new Date("2021-05-24T05:00:00.000Z"),
        endDate: new Date("2021-05-24T05:30:00.000Z"),
        recurrenceRule: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20210530"
    }, {
        text: "Website Re-Design Plan",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-24T06:00:00.000Z"),
        endDate: new Date("2021-05-24T08:30:00.000Z")
    }, {
        text: "Book Flights to San Fran for Sales Trip",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-24T09:00:00.000Z"),
        endDate: new Date("2021-05-24T10:00:00.000Z")
    }, {
        text: "Install New Router in Dev Room",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-24T11:30:00.000Z"),
        endDate: new Date("2021-05-24T12:30:00.000Z")
    }, {
        text: "Go Grocery Shopping",
        priorityId: 1,
        typeId: 1,
        startDate: new Date("2021-05-24T15:30:00.000Z"),
        endDate: new Date("2021-05-24T16:30:00.000Z"),
        recurrenceRule: "FREQ=DAILY;BYDAY=MO,WE,FR;UNTIL=20210530"
    }, {
        text: "Approve Personal Computer Upgrade Plan",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-25T07:00:00.000Z"),
        endDate: new Date("2021-05-25T08:00:00.000Z")
    }, {
        text: "Final Budget Review",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-25T09:00:00.000Z"),
        endDate: new Date("2021-05-25T10:35:00.000Z")
    }, {
        text: "New Brochures",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-25T11:30:00.000Z"),
        endDate: new Date("2021-05-25T12:45:00.000Z")
    }, {
        text: "Install New Database",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-26T06:45:00.000Z"),
        endDate: new Date("2021-05-26T08:15:00.000Z")
    }, {
        text: "Approve New Online Marketing Strategy",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-26T09:00:00.000Z"),
        endDate: new Date("2021-05-26T11:00:00.000Z")
    }, {
        text: "Upgrade Personal Computers",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-26T12:15:00.000Z"),
        endDate: new Date("2021-05-26T13:30:00.000Z")
    }, {
        text: "Prepare 2021 Marketing Plan",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-27T08:00:00.000Z"),
        endDate: new Date("2021-05-27T10:30:00.000Z")
    }, {
        text: "Brochure Design Review",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-27T11:00:00.000Z"),
        endDate: new Date("2021-05-27T12:30:00.000Z")
    }, {
        text: "Create Icons for Website",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-28T07:00:00.000Z"),
        endDate: new Date("2021-05-28T08:30:00.000Z")
    }, {
        text: "Upgrade Server Hardware",
        priorityId: 1,
        typeId: 2,
        startDate: new Date("2021-05-28T11:30:00.000Z"),
        endDate: new Date("2021-05-28T13:00:00.000Z")
    }, {
        text: "Submit New Website Design",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-28T13:30:00.000Z"),
        endDate: new Date("2021-05-28T15:00:00.000Z")
    }, {
        text: "Launch New Website",
        priorityId: 2,
        typeId: 2,
        startDate: new Date("2021-05-28T09:20:00.000Z"),
        endDate: new Date("2021-05-28T11:00:00.000Z")
    }, {
        text: "Visiting a Doctor",
        priorityId: 2,
        typeId: 1,
        startDate: new Date("2021-05-29T07:00:00.000Z"),
        endDate: new Date("2021-05-29T10:30:00.000Z")
    }
];


let priorityData: PriorityData[] = [{
        text: "Low Priority",
        id: 1,
        color: "#fcb65e"
    }, {
        text: "High Priority",
        id: 2,
        color: "#e18e92"
    }
];

let typeData: TypeData[] = [{
        text: "Home",
        id: 1,
        color: "#b6d623"
    }, {
        text: "Work",
        id: 2,
        color: "#679ec5"
    }
];

@Injectable()
export class Service {
	getPriorityData() {
		return priorityData;
	}
	getTypeData() {
		return typeData;
	}
    getData() {
        return data;
    }
}
