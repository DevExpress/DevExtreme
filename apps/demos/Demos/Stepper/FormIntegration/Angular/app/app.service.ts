import { Injectable } from '@angular/core';
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';
import type { BookingFormData } from "./app.types";

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly initialSteps: DxStepperTypes.Item[] = [
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

  private readonly initialFormData: BookingFormData = {
    dates: [null, null],
    adultsCount: 0,
    childrenCount: 0,
    petsCount: 0,
    roomType: undefined,
    mealPlan: undefined,
    additionalRequest: '',
  };

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
