import {
    Injectable
} from '@angular/core';

export class MedalsInfo {
    country: string;
    medals: number;
}

let medals: MedalsInfo[] = [{
    country: "USA",
    medals: 110
}, {
    country: "China",
    medals: 100
}, {
    country: "Russia",
    medals: 72
}, {
    country: "Britain",
    medals: 47
}, {
    country: "Australia",
    medals: 46
}, {
    country: "Germany",
    medals: 41
}, {
    country: "France",
    medals: 40
}, {
    country: "South Korea",
    medals: 31
}];

@Injectable()
export class Service {
    getMedalsData(): MedalsInfo[] {
        return medals;
    }
}