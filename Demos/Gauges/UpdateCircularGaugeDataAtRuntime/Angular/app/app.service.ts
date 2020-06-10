import {
    Injectable
} from '@angular/core';

export class Data {
    name: string;
    mean: number;
    min: number;
    max: number;
}

let dataSource: Data[] = [{
    name: 'Summer',
    mean: 35,
    min: 28,
    max: 38
}, {
    name: 'Autumn',
    mean: 24,
    min: 20,
    max: 32
}, {
    name: 'Winter',
    mean: 18,
    min: 16,
    max: 23
}, {
    name: 'Spring',
    mean: 27,
    min: 18,
    max: 31
}];

@Injectable()
export class Service {
    getData(): Data[] {
        return dataSource;
    }
}