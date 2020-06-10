import { Injectable } from '@angular/core';

export class MonthPeriod {
    date: string;
    dayT: number;
    nightT: number;
}

let periods: MonthPeriod[] = [{ date: "2013/03/01", dayT: 7, nightT: 2 },
    { date: "2013/03/02", dayT: 4, nightT: -1 },
    { date: "2013/03/03", dayT: 4, nightT: -2 },
    { date: "2013/03/04", dayT: 6, nightT: -3 },
    { date: "2013/03/05", dayT: 9, nightT: -1 },
    { date: "2013/03/06", dayT: 6, nightT: 3 },
    { date: "2013/03/07", dayT: 3, nightT: 1 },
    { date: "2013/03/08", dayT: 6, nightT: -1 },
    { date: "2013/03/09", dayT: 13, nightT: 2 },
    { date: "2013/03/10", dayT: 10, nightT: 2 },
    { date: "2013/03/11", dayT: 12, nightT: 4 },
    { date: "2013/03/12", dayT: 14, nightT: 6 },
    { date: "2013/03/13", dayT: 11, nightT: 3 },
    { date: "2013/03/14", dayT: 5, nightT: -2 },
    { date: "2013/03/15", dayT: 8, nightT: -1 },
    { date: "2013/03/16", dayT: 5, nightT: 0 },
    { date: "2013/03/17", dayT: 3, nightT: -2 },
    { date: "2013/03/18", dayT: 2, nightT: -2 },
    { date: "2013/03/19", dayT: 6, nightT: 1 },
    { date: "2013/03/20", dayT: 7, nightT: 0 },
    { date: "2013/03/21", dayT: 4, nightT: -1 },
    { date: "2013/03/22", dayT: 5, nightT: -2 },
    { date: "2013/03/23", dayT: 8, nightT: 0 },
    { date: "2013/03/24", dayT: 8, nightT: 1 },
    { date: "2013/03/25", dayT: 4, nightT: 2 },
    { date: "2013/03/26", dayT: 12, nightT: 3 },
    { date: "2013/03/27", dayT: 12, nightT: 2 },
    { date: "2013/03/28", dayT: 11, nightT: 3 },
    { date: "2013/03/29", dayT: 13, nightT: 4 },
    { date: "2013/03/30", dayT: 15, nightT: 4 },
    { date: "2013/03/31", dayT: 12, nightT: 7 }
];

@Injectable()
export class Service {
    getPeriods(): MonthPeriod[] {
        return periods;
    }
}