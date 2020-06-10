import { Injectable } from '@angular/core';

export class ProductType {
    id: number;
    text: string;
}

export class Product {
    text: string;
    type: number;
}

let productTypes: ProductType[] = [{
    id: 1,
    text: "All"
}, {
    id: 2,
    text: "Video Players"
}, {
    id: 3,
    text: "Televisions"
}, {
    id: 4,
    text: "Monitors"
}, {
    id: 5,
    text: "Projectors"
}];

var products: Product[] = [{
    text: "HD Video Player",
    type: 2
}, {
    text: "SuperHD Video Player",
    type: 2
}, {
    text: "SuperLCD 42",
    type: 3
}, {
    text: "SuperLED 42",
    type: 3
}, {
    text: "SuperLED 50",
    type: 3
}, {
    text: "SuperLCD 55",
    type: 3
}, {
    text: "DesktopLCD 19",
    type: 4
}, {
    text: "DesktopLCD 21",
    type: 4
}, {
    text: "DesktopLED 21",
    type: 4
}, {
    text: "Projector Plus",
    type: 5
}, {
    text: "Projector PlusHD",
    type: 5
}];


@Injectable()
export class Service {
    getProductTypes(): ProductType[] {
        return productTypes;
    }
    getProducts(): Product[] {
        return products;
    }
}
