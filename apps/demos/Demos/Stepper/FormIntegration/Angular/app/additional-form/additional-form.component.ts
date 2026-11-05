import { Component, input } from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { type DxFormTypes } from 'devextreme-angular/ui/form';
import { type DxTextAreaTypes } from 'devextreme-angular/ui/text-area';
import 'devextreme/ui/text_area';
import type { BookingFormData } from '../app.types';

@Component({
  selector: 'additional-form',
  templateUrl: './additional-form.component.html',
  imports: [
    DxFormModule,
  ],
})
export class AdditionalFormComponent {
  readonly formData = input.required<BookingFormData>();

  readonly textAreaOptions: DxTextAreaTypes.Properties = {
    height: 160,
    elementAttr: { id: 'additionalRequest' },
  };

  readonly labelOptions: DxFormTypes.SimpleItem['label'] = {
    visible: false,
  };
}
