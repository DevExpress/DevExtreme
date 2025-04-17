import { Component, Input } from '@angular/core';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'guests-form',
  templateUrl: `.${modulePrefix}/guests-form/guests-form.component.html`,
})
export class GuestsFormComponent {
  @Input() formData: BookingFormData;

  @Input() validationGroup: string;

  adultsLabelOptions: DxFormTypes.SimpleItem["label"] = {
    text: 'Adults',
    location: 'top',
  };

  childrenLabelOptions: DxFormTypes.SimpleItem["label"] = {
    text: 'Children',
    location: 'top',
  };

  petsLabelOptions: DxFormTypes.SimpleItem["label"] = {
    text: 'Pets',
    location: 'top',
  };

  numberBoxOptions: DxNumberBoxTypes.Properties = {
    min: 0,
    max: 5,
    showSpinButtons: true,
    elementAttr: { id: 'adultsCount' }
  };
}
