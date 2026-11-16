import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTagBoxModule,
  DxDateBoxModule,
  DxButtonModule,
  DxValidatorModule,
  DxDateRangeBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import type { EditorStyle, LabelMode } from 'devextreme-angular/common';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxTagBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidatorModule,
    DxDateRangeBoxModule,
  ],
})

export class AppComponent {
  readonly stylingMode = signal<EditorStyle>('outlined');

  readonly labelMode = signal<LabelMode>('static');

  readonly birthDate = new Date(1981, 5, 3);

  readonly states = inject(Service).getStates();

  readonly phoneRules = {
    X: /[02-9]/,
  };

  validateClick({ validationGroup }) {
    const result = validationGroup.validate();

    if (result.isValid) {
      notify('The task was saved successfully.', 'success');
    } else {
      notify('The task was not saved. Please check if all fields are valid.', 'error');
    }
  }
}

bootstrapApplication(AppComponent);
