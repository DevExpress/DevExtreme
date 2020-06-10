import { Injectable } from '@angular/core';

export class Data {
    value: number;
    originalValue: number;
    argument: number
}

function generateData(start:number, end:number, step:number) {
    const data:Data[] = [];
    for (let i = start; i < end; i += step) {
        const originalValue = Math.sin(i) / i;
        data.push({ value: originalValue + ((0.5 - Math.random()) / 10), originalValue: originalValue, argument: i });
    }
    return data;
  }

@Injectable()
export class Service {
    getData(): Data[] {
        return generateData(2.5, 12, 0.1);;
    }
}
