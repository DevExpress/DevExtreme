import { Injectable } from "@angular/core";
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';

@Injectable({
  providedIn: "root",
})
export class AppService {
  private readonly steps: DxStepperTypes.Item[] = [
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

  private readonly orientations = [
    { text: "Horizontal", value: "horizontal" },
    { text: "Vertical", value: "vertical" },
  ];

  private readonly navigationModes = [
    { text: 'Non-linear', value: false },
    { text: 'Linear', value: true },
  ];

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
