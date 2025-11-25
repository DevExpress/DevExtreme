import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
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

  filterModes: DxTreeListTypes.TreeListFilterMode[];

  filterModeValue: DxTreeListTypes.TreeListFilterMode = 'matchOnly';

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.filterModes = service.getFilterModes();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
