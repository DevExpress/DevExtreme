import {
  Component, effect, input, viewChild,
} from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { type DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import 'devextreme/ui/select_box';
import type { BookingFormData } from '../app.types';

@Component({
  selector: 'room-meal-plan-form',
  templateUrl: './room-meal-plan-form.component.html',
  imports: [
    DxFormModule,
  ],
})
export class RoomMealPlanFormComponent {
  private readonly form = viewChild<DxFormComponent>('formComponent');

  readonly formData = input.required<BookingFormData>();

  readonly validationGroup = input.required<string>();

  constructor() {
    effect(() => {
      this.form()?.instance?.reset(this.formData());
    });
  }

  readonly roomLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Room Type',
    location: 'top',
  };

  readonly mealLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Meal Plan',
    location: 'top',
  };

  private readonly roomTypes = ['Single', 'Double', 'Suite'];

  private readonly mealPlans = ['Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'];

  readonly mealSelectBoxOptions: DxSelectBoxTypes.Properties = {
    items: this.mealPlans,
    elementAttr: { id: 'mealPlan' },
  };

  readonly roomSelectBoxOptions: DxSelectBoxTypes.Properties = {
    items: this.roomTypes,
    elementAttr: { id: 'roomType' },
  };
}
