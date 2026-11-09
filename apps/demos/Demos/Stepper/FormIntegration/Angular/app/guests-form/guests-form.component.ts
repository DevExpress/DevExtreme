import {
  Component, effect, input, viewChild,
} from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { type DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
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
  private readonly form = viewChild<DxFormComponent>('formComponent');

  readonly formData = input.required<BookingFormData>();

  readonly validationGroup = input.required<string>();

  constructor() {
    effect(() => {
      this.form()?.instance?.reset(this.formData());
    });
  }

  readonly adultsLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Adults',
    location: 'top',
  };

  readonly childrenLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Children',
    location: 'top',
  };

  readonly petsLabelOptions: DxFormTypes.SimpleItem['label'] = {
    text: 'Pets',
    location: 'top',
  };

  readonly numberBoxOptions: DxNumberBoxTypes.Properties = {
    min: 0,
    max: 5,
    showSpinButtons: true,
    elementAttr: { id: 'adultsCount' },
  };
}
