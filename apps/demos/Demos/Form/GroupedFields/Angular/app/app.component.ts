import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFormModule } from 'devextreme-angular';

import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  employee: Employee;

  groupCaptionTemplates: Object;

  constructor(service: Service) {
    this.employee = service.getEmployee();

    this.groupCaptionTemplates = [
      { name: 'user', icon: 'dx-icon-user' },
      { name: 'info', icon: 'dx-icon-info' },
      { name: 'personal', icon: 'dx-icon-card' },
      { name: 'address', icon: 'dx-icon-home' },
      { name: 'contact', icon: 'dx-icon-tel' },
    ];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxFormModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
