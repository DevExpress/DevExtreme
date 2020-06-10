import {
    Injectable
} from '@angular/core';

export class Area {
    country: string;
    area: number;
}

let areas: Area[] = [{
    country: "Russia",
    area: 12
}, {
    country: "Canada",
    area: 7
}, {
    country: "USA",
    area: 7
}, {
    country: "China",
    area: 7
}, {
    country: "Brazil",
    area: 6
}, {
    country: "Australia",
    area: 5
}, {
    country: "India",
    area: 2
}, {
    country: "Others",
    area: 55
}];

@Injectable()
export class Service {
    getAreas(): Area[] {
        return areas;
    }
}