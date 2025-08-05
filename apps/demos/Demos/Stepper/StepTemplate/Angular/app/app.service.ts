import { Injectable } from '@angular/core';
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  steps: DxStepperTypes.Item[] = [];

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

  getSteps(): DxStepperTypes.Item[] {
    return this.steps;
  }
}
