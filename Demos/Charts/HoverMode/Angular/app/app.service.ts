import { Injectable } from '@angular/core';

export class GrossProduct {
    state: string;
    year1998: number;
    year2001: number;
    year2004: number;
}

let grossProductData: GrossProduct[] = [{
    state: "Illinois",
    year1998: 423.721,
    year2001: 476.851,
    year2004: 528.904
}, {
    state: "Indiana",
    year1998: 178.719,
    year2001: 195.769,
    year2004: 227.271
}, {
    state: "Michigan",
    year1998: 308.845,
    year2001: 335.793,
    year2004: 372.576
}, {
    state: "Ohio",
    year1998: 348.555,
    year2001: 374.771,
    year2004: 418.258
}, {
    state: "Wisconsin",
    year1998: 160.274,
    year2001: 182.373,
    year2004: 211.727
}];

@Injectable()
export class Service {
    getGrossProductData(): GrossProduct[] {
        return grossProductData;
    }
}
