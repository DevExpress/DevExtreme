import { Injectable } from '@angular/core';
import { Item } from 'devextreme/ui/stepper';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  steps: Item[] = [];

  constructor() {
    this.steps = [{
      text: 'A',
      title: 'Cart',
      icon: 'cart',
    },
    {
      text: 'B',
      title: 'Shipping Info',
      icon: 'clipboardtasklist',
    },
    {
      text: 'C',
      title: 'Promo Code',
      icon: 'gift',
      optional: true,
    },
    {
      text: 'D',
      title: 'Checkout',
      icon: 'packagebox',
    },
    {
      text: 'E',
      title: 'Ordered',
      icon: 'checkmarkcircle',
    }];
  }

  getSteps(): Item[] {
    return this.steps;
  }
}
