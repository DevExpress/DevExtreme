import { Injectable } from '@angular/core';

export class Data {
    text: string;
    startDate: Date;
    endDate: Date;
}

const data: Data[] = [
    {
        text: "Website Re-Design Plan",
        startDate: new Date(2021, 4, 24, 9, 30),
        endDate: new Date(2021, 4, 24, 11, 30)
    },
    {
        text: "Install New Router in Dev Room",
        startDate: new Date(2021, 4, 24, 13),
        endDate: new Date(2021, 4, 24, 14)
    },
    {
        text: "Approve Personal Computer Upgrade Plan",
        startDate: new Date(2021, 4, 25, 10),
        endDate: new Date(2021, 4, 25, 11)
    },
    {
        text: "Final Budget Review",
        startDate: new Date(2021, 4, 25, 13, 30),
        endDate: new Date(2021, 4, 25, 15)
    },
    {
        text: "New Brochures",
        startDate: new Date(2021, 4, 24, 15),
        endDate: new Date(2021, 4, 24, 16, 15)
    },
    {
        text: "Install New Database",
        startDate: new Date(2021, 4, 26, 9, 45),
        endDate: new Date(2021, 4, 26, 12)
    },
    {
        text: "Approve New Online Marketing Strategy",
        startDate: new Date(2021, 4, 26, 14, 30),
        endDate: new Date(2021, 4, 26, 16, 30)
    },
    {
        text: "Upgrade Personal Computers",
        startDate: new Date(2021, 4, 25, 15, 30),
        endDate: new Date(2021, 4, 25, 16, 45)
    },
    {
        text: "Prepare 2021 Marketing Plan",
        startDate: new Date(2021, 4, 31, 13),
        endDate: new Date(2021, 4, 31, 15)
    },
    {
        text: "Brochure Design Review",
        startDate: new Date(2021, 5, 1, 15, 30),
        endDate: new Date(2021, 5, 2)
    },
    {
        text: "Create Icons for Website",
        startDate: new Date(2021, 4, 28, 10),
        endDate: new Date(2021, 4, 28, 12)
    },
    {
        text: "Upgrade Server Hardware",
        startDate: new Date(2021, 4, 28, 16, 30),
        endDate: new Date(2021, 4, 28, 18)
    },
    {
        text: "Submit New Website Design",
        startDate: new Date(2021, 5, 2, 10),
        endDate: new Date(2021, 5, 2, 11, 30)
    },
    {
        text: "Launch New Website",
        startDate: new Date(2021, 4, 28, 14, 30),
        endDate: new Date(2021, 4, 28, 16, 10)
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
