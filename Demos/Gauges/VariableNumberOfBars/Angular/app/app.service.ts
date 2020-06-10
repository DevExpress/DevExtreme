import {
    Injectable
} from '@angular/core';

export class Product {
    name: string;
    count: number;
    active: boolean;
}

let products: Product[] = [{
    name: 'Hummers',
    count: 41,
    active: true
}, {
    name: 'Shovers',
    count: 32,
    active: true
}, {
    name: 'Ladders',
    count: 13,
    active: true
}, {
    name: 'Watering cans',
    count: 48,
    active: true
}, {
    name: 'Screwdrivers',
    count: 24,
    active: true
}, {
    name: 'Nail pullers',
    count: 8,
    active: true
}, {
    name: 'Drills',
    count: 19,
    active: true
}];

@Injectable()
export class Service {
    getProducts(): Product[] {
        return products;
    }
}