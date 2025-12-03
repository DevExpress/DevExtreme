import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCardViewModule, DxTextAreaModule } from 'devextreme-angular';
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
  providers: [Service],
  imports: [
    DxCardViewModule,
    DxTextAreaModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  popupConfig = {
    title: 'Employee Info',
    showTitle: true,
    width: 700,
    height: 525,
  };

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  altExpr({ fullName }: Employee) {
    return `Photo of ${fullName}`;
  }

  imageExpr({ picture }: Employee) {
    return picture;
  }

  calculateFullName({ firstName, lastName }: Employee) {
    return `${firstName} ${lastName}`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
