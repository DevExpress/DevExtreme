import { Injectable } from "@angular/core";
import { Item } from "devextreme/ui/stepper";

@Injectable({
  providedIn: "root"
})
export class AppService {
  steps: Item[] = [];
  orientations = [];
  navigationModes = [];

  constructor() {
    this.steps = [
      {
        text: "A",
        label: "Cart",
        icon: "cart"
      },
      {
        text: "B",
        label: "Shipping Info",
        icon: "clipboardtasklist"
      },
      {
        text: "C",
        label: "Promo Code",
        icon: "gift",
        optional: true
      },
      {
        text: "D",
        label: "Checkout",
        icon: "packagebox"
      },
      {
        text: "E",
        label: "Ordered",
        icon: "checkmarkcircle"
      }
    ];

    this.orientations = [
      { text: "Horizontal", value: "horizontal" },
      { text: "Vertical", value: "vertical" }
    ];

    this.navigationModes = [
      { text: 'Non-linear', value: false },
      { text: 'Linear', value: true },
    ]
  }

  getSteps(): Item[] {
    return this.steps;
  }

  getOrientations() {
    return this.orientations;
  }

  getNavigationModes() {
    return this.navigationModes;
  }
}
