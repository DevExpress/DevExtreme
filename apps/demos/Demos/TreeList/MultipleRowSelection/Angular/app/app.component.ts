import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
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
  imports: [
    DxTreeListModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  selectedRowKeys: number[] = [];

  recursiveSelectionEnabled = false;

  selectedEmployeeNames = 'Nobody has been selected';

  selectionMode = 'all';

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  onSelectionChanged(e: DxTreeListTypes.SelectionChangedEvent) {
    const selectedData: Employee[] = e.component.getSelectedRowsData(this.selectionMode);
    this.selectedEmployeeNames = this.getEmployeeNames(selectedData);
  }

  onOptionsChanged() {
    this.selectedRowKeys = [];
  }

  getEmployeeNames = (employees: Employee[]) => (employees.length > 0
    ? employees.map((employee) => employee.Full_Name).join(', ')
    : 'Nobody has been selected');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
