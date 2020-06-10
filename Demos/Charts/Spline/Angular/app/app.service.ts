import { Injectable } from '@angular/core';

export class ArchitectureInfo {
    year: number;
    smp: number;
    mmp: number;
    cnstl: number;
    cluster: number;
}

let architecturesInfo: ArchitectureInfo[]  = [{
    year: 1997,
    smp: 263,
    mmp: 226,
    cnstl: 10,
    cluster: 1
}, {
    year: 1999,
    smp: 169,
    mmp: 256,
    cnstl: 66,
    cluster: 7
}, {
    year: 2001,
    smp: 57,
    mmp: 257,
    cnstl: 143,
    cluster: 43
}, {
    year: 2003,
    smp: 0,
    mmp: 163,
    cnstl: 127,
    cluster: 210
}, {
    year: 2005,
    smp: 0,
    mmp: 103,
    cnstl: 36,
    cluster: 361
}, {
    year: 2007,
    smp: 0,
    mmp: 91,
    cnstl: 3,
    cluster: 406
}];

@Injectable()
export class Service {
    getArchitecturesInfo(): ArchitectureInfo[] {
        return architecturesInfo;
    }
}
