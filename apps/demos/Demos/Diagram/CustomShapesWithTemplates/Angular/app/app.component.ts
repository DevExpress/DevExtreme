import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxPopupModule, DxDiagramModule,
} from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { Service, Employee } from './app.service';

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
  preserveWhitespaces: true,
  imports: [
    DxDiagramModule,
    DxPopupModule,
  ],
})
export class AppComponent {
  currentEmployee: Employee = new Employee();

  employees: Employee[];

  dataSource: ArrayStore;

  popupVisible = false;

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.dataSource = new ArrayStore({
      key: 'ID',
      data: service.getEmployees(),
    });
  }

  itemTypeExpr(obj, value) {
    if (value === undefined) {
      return `employee${obj.ID}`;
    }
    obj.type = value;
    return null;
  }

  showInfo(employee) {
    this.currentEmployee = employee;
    this.popupVisible = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
