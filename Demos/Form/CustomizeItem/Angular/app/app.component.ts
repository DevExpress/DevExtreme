import {
  NgModule, Component, ViewChild, enableProdMode, AfterViewInit,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxSelectBoxModule,
  DxTextAreaModule,
  DxFormModule,
  DxFormComponent,
  DxTooltipModule,
} from 'devextreme-angular';

import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent implements AfterViewInit {
  @ViewChild(DxFormComponent, { static: false }) myform: DxFormComponent;

  employee: Employee;

  positions: string[];

  nameEditorOptions: Object;

  positionEditorOptions: Object;

  validationRules: Object;

  hireDateEditorOptions: Object;

  birthDateEditorOptions: Object;

  notesEditorOptions: Object;

  phonesEditorOptions: Object;

  constructor(service: Service) {
    this.employee = service.getEmployee();

    this.nameEditorOptions = { disabled: true };
    this.positionEditorOptions = { items: service.getPositions(), searchEnabled: true, value: '' };
    this.validationRules = {
      position: [
        { type: 'required', message: 'Position is required.' },
      ],
      hireDate: [
        { type: 'required', message: 'Hire Date is required.' },
      ],
    };
    this.hireDateEditorOptions = { width: '100%', value: null };
    this.birthDateEditorOptions = { width: '100%', disabled: true };
    this.notesEditorOptions = { height: 90, maxLength: 200 };
    this.phonesEditorOptions = { mask: '+1 (X00) 000-0000', maskRules: { X: /[02-9]/ } };
  }

  ngAfterViewInit() {
    this.myform.instance.validate();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxFormModule,
    DxTooltipModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
