import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  enableProdMode,
  inject,
  viewChild,
  type AfterViewInit,
} from '@angular/core';
import {
  DxFormModule,
  DxFormComponent,
  DxTooltipModule,
} from 'devextreme-angular';
import 'devextreme/ui/select_box';
import 'devextreme/ui/text_area';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxFormModule,
    DxTooltipModule,
  ],
})

export class AppComponent implements AfterViewInit {
  private readonly service = inject(Service);

  private readonly form = viewChild.required(DxFormComponent);

  readonly employee = this.service.getEmployee();

  readonly nameEditorOptions: Object = { disabled: true };

  readonly positionEditorOptions: Object = { items: this.service.getPositions(), searchEnabled: true, value: '' };

  readonly validationRules: Object = {
    position: [
      { type: 'required', message: 'Position is required.' },
    ],
    hireDate: [
      { type: 'required', message: 'Hire Date is required.' },
    ],
  };

  readonly hireDateEditorOptions: Object = { width: '100%', value: null };

  readonly birthDateEditorOptions: Object = { width: '100%', disabled: true };

  readonly notesEditorOptions: Object = { height: 90, maxLength: 200 };

  readonly phoneEditorOptions: Object = { mask: '(X00) 000-0000', maskRules: { X: /[02-9]/ } };

  readonly labelTemplates: { name: string; icon: string }[] = [
    { name: 'name', icon: 'dx-icon-user' },
    { name: 'position', icon: 'dx-icon-info' },
    { name: 'date', icon: 'dx-icon-event' },
    { name: 'address', icon: 'dx-icon-home' },
    { name: 'phone', icon: 'dx-icon-tel' },
    { name: 'email', icon: 'dx-icon-email' },
  ];

  ngAfterViewInit() {
    this.form().instance.validate();
  }
}

bootstrapApplication(AppComponent);
