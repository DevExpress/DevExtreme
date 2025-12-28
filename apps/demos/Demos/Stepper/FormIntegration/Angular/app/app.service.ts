import { Injectable } from '@angular/core';
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';
import type { BookingFormData } from "./app.types";

@Injectable({
  providedIn: 'root',
})
export class AppService {
  initialSteps: DxStepperTypes.Item[];

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

  getInitialSteps(): DxStepperTypes.Item[] {
    return this.initialSteps.map((item) => ({ ...item }));
  }

  getInitialFormData(): BookingFormData {
    return {
      ...this.initialFormData,
      dates: [...this.initialFormData.dates],
    };
  }
}
