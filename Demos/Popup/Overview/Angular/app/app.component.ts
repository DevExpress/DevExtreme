import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPopupModule, DxButtonModule, DxTemplateModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})

export class AppComponent {
  currentEmployee: Employee = new Employee();

  employees: Employee[];

  popupVisible = false;

  moreInfoButtonOptions: any;

  emailButtonOptions: any;

  closeButtonOptions: any;

  positionOf: string;

  constructor(service: Service) {
    const that = this;
    this.employees = service.getEmployees();
    this.moreInfoButtonOptions = {
      text: 'More info',
      onClick(e) {
        const message = `More info about ${that.currentEmployee.FirstName} ${that.currentEmployee.LastName}`;
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
      text: 'Send',
      onClick(e) {
        const message = `Email is sent to ${that.currentEmployee.FirstName} ${that.currentEmployee.LastName}`;
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
      onClick(e) {
        that.popupVisible = false;
      },
    };
  }

  detailsButtonMouseEnter(id) {
    this.positionOf = `#image${id}`;
  }

  showInfo(employee) {
    this.currentEmployee = employee;
    this.popupVisible = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
