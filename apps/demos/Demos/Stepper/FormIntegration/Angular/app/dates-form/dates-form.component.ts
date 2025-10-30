import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DxFormComponent, type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxDateRangeBoxTypes } from 'devextreme-angular/ui/date-range-box';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  standalone: false,
  selector: 'dates-form',
  standalone: false,
  templateUrl: `.${modulePrefix}/dates-form/dates-form.component.html`,
})
export class DatesFormComponent {
  @ViewChild('formComponent', { static: false }) form!: DxFormComponent;

  @Input() formData: BookingFormData;

  @Input() validationGroup: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formData) {
      const value = changes.formData.currentValue;

      this.form?.instance?.reset(value);
    }
  }

  dateRangeBoxOptions: DxDateRangeBoxTypes.Properties = {
    startDatePlaceholder: 'Check-in',
    endDatePlaceholder: 'Check-out',
    elementAttr: { id: 'datesPicker' },
  };

  labelOptions: DxFormTypes.SimpleItem['label'] = {
    visible: false,
  };
}
