import {
  Component, effect, input, viewChild,
} from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { type DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxDateRangeBoxTypes } from 'devextreme-angular/ui/date-range-box';
import 'devextreme/ui/date_range_box';
import type { BookingFormData } from '../app.types';

@Component({
  selector: 'dates-form',
  templateUrl: './dates-form.component.html',
  imports: [
    DxFormModule,
  ],
})
export class DatesFormComponent {
  private readonly form = viewChild<DxFormComponent>('formComponent');

  readonly formData = input.required<BookingFormData>();

  readonly validationGroup = input.required<string>();

  constructor() {
    effect(() => {
      this.form()?.instance?.reset(this.formData());
    });
  }

  readonly dateRangeBoxOptions: DxDateRangeBoxTypes.Properties = {
    startDatePlaceholder: 'Check-in',
    endDatePlaceholder: 'Check-out',
    elementAttr: { id: 'datesPicker' },
  };

  readonly labelOptions: DxFormTypes.SimpleItem['label'] = {
    visible: false,
  };
}
