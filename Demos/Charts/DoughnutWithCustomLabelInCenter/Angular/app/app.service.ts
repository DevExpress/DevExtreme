import {
    Injectable
} from '@angular/core';

export class DataItem {
    country: string;
    commodity: string;
    total: number;
}
const data:DataItem[] = [
    { country: "France", commodity: "Nuclear", total: 403195 },
    { country: "Germany", commodity: "Nuclear", total: 84634 },
    { country: "France", commodity: "Thermal", total: 57471 },
    { country: "Germany", commodity: "Thermal", total: 419591 },
    { country: "France", commodity: "Wind", total: 21400 },
    { country: "Germany", commodity: "Wind", total: 78598 },
    { country: "France", commodity: "Solar", total: 8160 },
    { country: "Germany", commodity: "Solar", total: 38098 },
    { country: "France", commodity: "Tidal, Wave", total: 501 }
];


var cache = {}

@Injectable()
export class Service {
    getData(country?: string): DataItem[] {
        if (country) {
            return cache[country] = cache[country] || data.filter(item => item.country === country);
        }
        return data;
    }
}