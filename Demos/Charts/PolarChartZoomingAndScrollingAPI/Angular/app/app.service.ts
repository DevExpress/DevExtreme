import { Injectable } from '@angular/core';

export class DataFrame {
    argument: number;
    value: number;
    originalValue: number;
}

function generateData(start: number, end: number, step: number) {
    const data: DataFrame[] = [];
    for (let i = start; i < end; i += step) {
        const originalValue = Math.log(i);
        data.push({ value: originalValue - (Math.sin(Math.random() * i) * i / end) + (1 - Math.random() * 2), originalValue: originalValue, argument: i });
    }
    return data;
}

@Injectable()
export class Service {
    getDataSource(): DataFrame[] {
        return generateData(0, 360, 0.75);
    }
}
