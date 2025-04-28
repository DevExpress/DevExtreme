import { Injectable } from '@angular/core';
import { Item } from 'devextreme/ui/stepper';
import {BookingFormData} from "./app.types";
import {initialFormData, initialSteps} from "../../Vue/data";

@Injectable({
  providedIn: 'root',
})
export class AppService {
  initialSteps: Item[];

  initialFormData: BookingFormData;

  roomTypes: string[];

  mealPlans: string[];

  constructor() {
    this.initialSteps = [
      {
        label: 'Dates', hint: 'Dates', icon: 'daterangepicker',
      },
      {
        label: 'Guests', hint: 'Guests', icon: 'group',
      },
      {
        label: 'Room and Meal Plan', hint: 'Room and Meal Plan', icon: 'servicebell',
      },
      {
        label: 'Additional Requests', hint: 'Additional Requests', icon: 'clipboardtasklist', optional: true,
      },
      {
        label: 'Confirmation', hint: 'Confirmation', icon: 'checkmarkcircle',
      },
    ];

    this.initialFormData = {
      dates: [null, null],
      adultsCount: 0,
      childrenCount: 0,
      petsCount: 0,
      roomType: undefined,
      mealPlan: undefined,
      additionalRequest: '',
    };
  }

  getInitialSteps(): Item[] {
    return this.initialSteps.map((item) => ({ ...item }));
  }

  getInitialFormData(): BookingFormData {
    return {
      ...this.initialFormData,
      dates: [...this.initialFormData.dates],
    };
  }
}
