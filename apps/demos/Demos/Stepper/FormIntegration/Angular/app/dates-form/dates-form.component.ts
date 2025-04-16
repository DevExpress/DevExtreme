import { Component, Input } from '@angular/core';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxDateRangeBoxTypes } from 'devextreme-angular/ui/date-range-box';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'dates-form',
  templateUrl: `.${modulePrefix}/dates-form/dates-form.component.html`,
})
export class DatesFormComponent {
  @Input() formData: BookingFormData;

  @Input() validationGroup: string;

  dateRangeBoxOptions: DxDateRangeBoxTypes.Properties = {
    startDatePlaceholder: 'Check-in',
    endDatePlaceholder: 'Check-out',
    elementAttr: { id: 'datesPicker' },
  }

  labelOptions: DxFormTypes.SimpleItem["label"] = {
    visible: false,
  };
}
