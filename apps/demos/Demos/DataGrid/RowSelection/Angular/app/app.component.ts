import {
  Component,
  enableProdMode,
  inject,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxDataGridModule, type DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [DxDataGridModule],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly selectedEmployee = signal<Employee | undefined>(undefined);

  onSelectionChanged({ selectedRowsData }: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedEmployee.set(selectedRowsData[0]);
  }
}

bootstrapApplication(AppComponent);
