import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxPopupModule, DxTemplateModule, DxDiagramModule, DxDiagramComponent,
} from 'devextreme-angular';
import ArrayStore from 'devextreme/data/array_store';
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

  itemTypeExpr(obj) {
    return `employee${obj.ID}`;
  }

  showInfo(employee) {
    this.currentEmployee = employee;
    this.popupVisible = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDiagramModule,
    DxPopupModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
