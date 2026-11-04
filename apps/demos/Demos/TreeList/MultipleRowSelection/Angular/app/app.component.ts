import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxTreeListModule, type DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { Service, type Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTreeListModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly selectedRowKeys = signal<number[]>([]);

  readonly recursiveSelectionEnabled = signal(false);

  readonly selectedEmployeeNames = signal('Nobody has been selected');

  readonly selectionMode = signal('all');

  onSelectionChanged(e: DxTreeListTypes.SelectionChangedEvent) {
    const selectedData: Employee[] = e.component.getSelectedRowsData(this.selectionMode());
    this.selectedEmployeeNames.set(this.getEmployeeNames(selectedData));
  }

  onOptionsChanged() {
    this.selectedRowKeys.set([]);
  }

  private readonly getEmployeeNames = (employees: Employee[]) => (employees.length > 0
    ? employees.map((employee) => employee.Full_Name).join(', ')
    : 'Nobody has been selected');
}

bootstrapApplication(AppComponent);
