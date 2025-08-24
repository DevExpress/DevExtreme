import { Component, Input } from '@angular/core';
import { type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxTextAreaTypes } from 'devextreme-angular/ui/text-area';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'additional-form',
  templateUrl: `.${modulePrefix}/additional-form/additional-form.component.html`,
})
export class AdditionalFormComponent {
  @Input() formData: BookingFormData;

  textAreaOptions: DxTextAreaTypes.Properties = {
    height: 160,
    elementAttr: { id: 'additionalRequest' },
  };

  labelOptions: DxFormTypes.SimpleItem["label"] = {
    visible: false,
  };
}
