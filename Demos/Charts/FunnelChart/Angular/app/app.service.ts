import { Injectable } from '@angular/core';

export class itemInfo {
    argument: string;
    value: number;
}

let data: itemInfo[]  = [
    { argument: "Visited the Website", value: 9152 },
    { argument: "Downloaded a Trial", value: 6879 },
    { argument: "Contacted Support", value: 5121 },
    { argument: "Subscribed", value: 2224 },
    { argument: "Renewed", value: 1670 }
];

@Injectable()
export class Service {
    getData(): itemInfo[] {
        return data;
    }
}