import { Injectable } from '@angular/core';

export class Data {
    text: string;
    startDate: Date;
    endDate: Date;
}

const data: Data[] = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date("2021-05-24T06:30:00.000Z"),
        endDate: new Date("2021-05-24T08:30:00.000Z")
    },
    {
        text: "Install New Router in Dev Room",
        startDate: new Date("2021-05-24T10:00:00.000Z"),
        endDate: new Date("2021-05-24T11:00:00.000Z")
    },
    {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date("2021-05-25T07:00:00.000Z"),
        endDate: new Date("2021-05-25T08:00:00.000Z")
    },
    {
        text: "Final Budget Review",
        startDate: new Date("2021-05-25T10:30:00.000Z"),
        endDate: new Date("2021-05-25T12:00:00.000Z")
    },
    {
        text: "New Brochures",
        startDate: new Date("2021-05-24T12:00:00.000Z"),
        endDate: new Date("2021-05-24T13:15:00.000Z")
    },
    {
        text: "Install New Database",
        startDate: new Date("2021-05-26T06:45:00.000Z"),
        endDate: new Date("2021-05-26T09:00:00.000Z")
    },
    {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date("2021-05-26T11:30:00.000Z"),
        endDate: new Date("2021-05-26T13:30:00.000Z")
    },
    {
        text: "Upgrade Personal Computers",
        startDate: new Date("2021-05-25T12:30:00.000Z"),
        endDate: new Date("2021-05-25T13:45:00.000Z")
    },
    {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date("2021-05-31T10:00:00.000Z"),
        endDate: new Date("2021-05-31T12:00:00.000Z")
    },
    {
        text: "Brochure Design Review",
        startDate: new Date("2021-06-01T12:30:00.000Z"),
        endDate: new Date("2021-06-01T14:00:00.000Z")
    },
    {
        text: "Create Icons for Website",
        startDate: new Date("2021-05-28T07:00:00.000Z"),
        endDate: new Date("2021-05-28T09:00:00.000Z")
    },
    {
        text: "Upgrade Server Hardware",
        startDate: new Date("2021-05-28T13:30:00.000Z"),
        endDate: new Date("2021-05-28T15:00:00.000Z")
    },
    {
        text: "Submit New Website Design",
        startDate: new Date("2021-05-31:00:00.000Z"),
        endDate: new Date("2021-06-02T08:30:00.000Z")
    },
    {
        text: "Launch New Website",
        startDate: new Date("2021-05-28T11:30:00.000Z"),
        endDate: new Date("2021-05-28T13:10:00.000Z")
    }
];

@Injectable()
export class DataService {
    getData() {
        return data;
    }

    getDinnerTime() {
        return { from: 12, to: 13 };
    }

    getHolidays() {
        return [
            new Date(2021, 4, 27),
            new Date(2021, 6, 4)
        ];
    }
}
