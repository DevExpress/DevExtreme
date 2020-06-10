import { Injectable } from '@angular/core';

export interface SalesAmount {
    name: string;
    items: any;
}

let salesAmount: SalesAmount[] = [{
    name: "Monitors",
    items: [{
        name: "DesktopLCD 19",
        salesAmount : 23420
    }, {
        name: "DesktopLCD 21",
        salesAmount : 113900
    }, {
        name: "DesktopLED 19",
        salesAmount : 49170
    }, {
        name: "DesktopLED 21",
        salesAmount : 81200
    }]
}, {
    name: "Projectors",
    items: [{
        name: "Projector Plus",
        salesAmount: 99000
    }, {
        name: "Projector PlusHD",
        salesAmount: 152250
    }]
}, {
    name: "Televisions",
    items: [{
        name: "SuperLCD 55",
        salesAmount: 147150
    }, {
        name: "SuperLCD 42",
        salesAmount: 103200
    }, {
        name: "SuperLCD 70",
        salesAmount: 56000
    }, {
        name: "SuperLED 42",
        salesAmount: 159500
    }, {
        name: "SuperLED 50",
        salesAmount: 233600
    }, {
        name: "SuperPlasma 50",
        salesAmount: 184800
    }, {
        name: "SuperPlasma 65",
        salesAmount: 178500
    }]
}, {
    name: "Video Players",
    items: [{
        name: "HD Video Player",
        salesAmount: 63690
    }, {
        name: "SuperHD Video Player",
        salesAmount: 74000
    }]
}];

@Injectable()
export class Service {
    getSalesAmount() {
        return salesAmount;
    }
}
