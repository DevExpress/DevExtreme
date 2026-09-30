import {
  Component,
  enableProdMode,
  provideZoneChangeDetection,
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
  employees: Employee[];

  selectedEmployee: Employee | undefined;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  onSelectionChanged({ selectedRowsData }: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedEmployee = selectedRowsData[0];
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
