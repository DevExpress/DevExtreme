import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
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
  imports: [
    DxTreeListModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  resizingModes: DxTreeListTypes.ColumnResizeMode[] = ['nextColumn', 'widget'];

  columnResizingMode = this.resizingModes[0];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  selectResizing({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.columnResizingMode = value;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
