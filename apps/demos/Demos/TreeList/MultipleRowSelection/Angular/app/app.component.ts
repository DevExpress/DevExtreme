import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, Employee } from './app.service';

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

  onOptionsChanged(e: DxSelectBoxTypes.OptionChangedEvent) {
    this.selectedRowKeys = [];
  }

  getEmployeeNames = (employees: Employee[]) => (employees.length > 0
    ? employees.map((employee) => employee.Full_Name).join(', ')
    : 'Nobody has been selected');
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTreeListModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
