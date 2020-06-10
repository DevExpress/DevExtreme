import { Injectable } from '@angular/core';

export class Product {
    weight: string;
    appleCost: number;
    orangeCost: number;
}

let products: Product[] = [
      { weight: "1", appleCost: 3, orangeCost: 7 },
      { weight: "2", appleCost: 20, orangeCost: 14 },
      { weight: "3", appleCost: 21, orangeCost: 21 },
      { weight: "4", appleCost: 22, orangeCost: 28 },
      { weight: "5", appleCost: 25, orangeCost: 35 },
      { weight: "6", appleCost: 30, orangeCost: 42 },
      { weight: "7", appleCost: 35, orangeCost: 44 },
      { weight: "8", appleCost: 42, orangeCost: 45 },
      { weight: "9", appleCost: 49, orangeCost: 46 },
      { weight: "10", appleCost: 60, orangeCost: 47 }
];

@Injectable()
export class Service {
    getProducts(): Product[] {
        return products;
    }
}