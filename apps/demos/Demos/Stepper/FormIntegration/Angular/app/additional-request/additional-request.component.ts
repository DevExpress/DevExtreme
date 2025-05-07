import { Component, Input } from '@angular/core';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxTextAreaTypes } from 'devextreme-angular/ui/text-area';
import type { BookingFormData } from '../app.types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'additional-request',
  templateUrl: `.${modulePrefix}/additional-request/additional-request.component.html`,
})
export class AdditionalRequestComponent {
  @Input() formData: BookingFormData;

  textAreaOptions: DxTextAreaTypes.Properties = {
    height: 160,
    elementAttr: { id: 'additionalRequest' },
  }

  labelOptions: DxFormTypes.SimpleItem["label"] = {
    visible: false,
  };
}
