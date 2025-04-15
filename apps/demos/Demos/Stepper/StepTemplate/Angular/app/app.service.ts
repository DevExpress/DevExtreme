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
      label: 'Cart',
      icon: 'cart',
    },
    {
      text: 'B',
      label: 'Shipping Info',
      icon: 'clipboardtasklist',
    },
    {
      text: 'C',
      label: 'Promo Code',
      icon: 'gift',
      optional: true,
    },
    {
      text: 'D',
      label: 'Checkout',
      icon: 'packagebox',
    },
    {
      text: 'E',
      label: 'Ordered',
      icon: 'checkmarkcircle',
    }];
  }

  getSteps(): Item[] {
    return this.steps;
  }
}
