import { Component, Input } from '@angular/core';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'room-meal-plan-form',
  templateUrl: `.${modulePrefix}/room-meal-plan-form/room-meal-plan-form.component.html`,
})
export class RoomMealPlanFormComponent {
  @Input() formData: BookingFormData;

  @Input() validationGroup: string;

  roomLabelOptions: DxFormTypes.SimpleItem["label"] = {
    text: 'Room Type',
    location: 'top',
  };

  mealLabelOptions: DxFormTypes.SimpleItem["label"] = {
    text: 'Meal Plan',
    location: 'top',
  };

  roomTypes = ['Single', 'Double', 'Suite'];

  mealPlans = ['Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'];

  mealSelectBoxOptions: DxSelectBoxTypes.Properties = {
    items: this.mealPlans,
  };

  roomSelectBoxOptions: DxSelectBoxTypes.Properties = {
    items: this.roomTypes,
  }
}
