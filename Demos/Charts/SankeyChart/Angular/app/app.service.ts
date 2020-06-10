import { Injectable } from '@angular/core';

export class DataItem {
    source: string;
    target: string;
    weight: number;
}

const Data: DataItem[] = [
    { source: 'Spain', target: 'United States of America', weight: 2 },
    { source: 'Germany', target: 'United States of America', weight: 8 },
    { source: 'France', target: 'United States of America', weight: 4 },
    { source: 'Germany', target: 'Great Britain', weight: 2 },
    { source: 'France', target: 'Great Britain', weight: 4 },
    { source: 'United States of America', target: 'Australia', weight: 6 },
    { source: 'United States of America', target: 'New Zealand', weight: 5 },
    { source: 'United States of America', target: 'Japan', weight: 3 },
    { source: 'Great Britain', target: 'New Zealand', weight: 4 },
    { source: 'Great Britain', target: 'Japan', weight: 1 }
];

@Injectable()
export class Service {
    getData(): DataItem[] {
        return Data;
    }
}