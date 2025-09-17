import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
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
  @ViewChild('formComponent', { static: false }) form!: DxFormComponent;

  @Input() formData: BookingFormData;

  @Input() validationGroup: string;

  ngOnChanges(changes: SimpleChanges) {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (changes['formData']) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const value = changes['formData'].currentValue;

      this.form?.instance?.reset(value);
    }
  }

  roomLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Room Type',
    location: 'top',
  };

  mealLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Meal Plan',
    location: 'top',
  };

  roomTypes = ['Single', 'Double', 'Suite'];

  mealPlans = ['Bed & Breakfast', 'Half Board', 'Full Board', 'All-Inclusive'];

  mealSelectBoxOptions: DxSelectBoxTypes.Properties = {
    items: this.mealPlans,
    elementAttr: { id: 'mealPlan' },
  };

  roomSelectBoxOptions: DxSelectBoxTypes.Properties = {
    items: this.roomTypes,
    elementAttr: { id: 'roomType' },
  };
}
