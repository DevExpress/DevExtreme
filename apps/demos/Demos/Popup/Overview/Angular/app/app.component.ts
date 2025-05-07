import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPopupModule, DxButtonModule, DxTemplateModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})

export class AppComponent {
  currentEmployee: Employee = new Employee();

  employees: Employee[];

  popupVisible = false;

  moreInfoButtonOptions: Record<string, unknown>;

  emailButtonOptions: Record<string, unknown>;

  closeButtonOptions: Record<string, unknown>;

  positionOf: string;

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.moreInfoButtonOptions = {
      text: 'More info',
      onClick: () => {
        const message = `More info about ${this.currentEmployee.FirstName} ${this.currentEmployee.LastName}`;
        notify({
          message,
          position: {
            my: 'center top',
            at: 'center top',
          },
        }, 'success', 3000);
      },
    };
    this.emailButtonOptions = {
      icon: 'email',
      stylingMode: 'contained',
      text: 'Send',
      onClick: () => {
        const message = `Email is sent to ${this.currentEmployee.FirstName} ${this.currentEmployee.LastName}`;
        notify({
          message,
          position: {
            my: 'center top',
            at: 'center top',
          },
        }, 'success', 3000);
      },
    };
    this.closeButtonOptions = {
      text: 'Close',
      stylingMode: 'outlined',
      type: 'normal',
      onClick: () => {
        this.popupVisible = false;
      },
    };
  }

  detailsButtonMouseEnter(id: number) {
    this.positionOf = `#image${id}`;
  }

  showInfo(employee: Employee) {
    this.currentEmployee = employee;
    this.popupVisible = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
