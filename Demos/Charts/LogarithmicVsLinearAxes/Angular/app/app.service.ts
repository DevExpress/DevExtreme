import { Injectable } from '@angular/core';

export class Data {
    arg: number;
    val: number;
}

const data: Data[] = [];

for (let i = 0; i < 600; i += 1) {
    const argument = i / 100;
    data.push({ arg: argument, val: Math.exp(-argument) * Math.cos(2 * Math.PI * argument) });
}

@Injectable()
export class Service {
    getData(): Data[] {
        return data;
    }
}
