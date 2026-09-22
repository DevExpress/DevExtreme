import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';
import type { BookingFormData } from '../app.types';

@Component({
  selector: 'guests-form',
  templateUrl: './guests-form.component.html',
  imports: [
    DxFormModule,
  ],
})
export class GuestsFormComponent {
  @ViewChild('formComponent', { static: false }) form!: DxFormComponent;

  @Input() formData: BookingFormData;

  @Input() validationGroup: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formData) {
      const value = changes.formData.currentValue;

      this.form?.instance?.reset(value);
    }
  }

  adultsLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Adults',
    location: 'top',
  };

  childrenLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Children',
    location: 'top',
  };

  petsLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Pets',
    location: 'top',
  };

  numberBoxOptions: DxNumberBoxTypes.Properties = {
    min: 0,
    max: 5,
    showSpinButtons: true,
    elementAttr: { id: 'adultsCount' },
  };
}
