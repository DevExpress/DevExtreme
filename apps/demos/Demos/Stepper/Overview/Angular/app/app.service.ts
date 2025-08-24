import { Injectable } from "@angular/core";
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';

@Injectable({
  providedIn: "root",
})
export class AppService {
  steps: DxStepperTypes.Item[] = [];
  orientations = [];
  navigationModes = [];

  constructor() {
    this.steps = [
      {
        text: "A",
        label: "Cart",
        icon: "cart",
      },
      {
        text: "B",
        label: "Shipping Info",
        icon: "clipboardtasklist",
      },
      {
        text: "C",
        label: "Promo Code",
        icon: "gift",
        optional: true,
      },
      {
        text: "D",
        label: "Checkout",
        icon: "packagebox",
      },
      {
        text: "E",
        label: "Ordered",
        icon: "checkmarkcircle",
      },
    ];

    this.orientations = [
      { text: "Horizontal", value: "horizontal" },
      { text: "Vertical", value: "vertical" },
    ];

    this.navigationModes = [
      { text: 'Non-linear', value: false },
      { text: 'Linear', value: true },
    ]
  }

  getSteps(): DxStepperTypes.Item[] {
    return this.steps;
  }

  getOrientations() {
    return this.orientations;
  }

  getNavigationModes() {
    return this.navigationModes;
  }
}
