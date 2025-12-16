import { bootstrapApplication } from '@angular/platform-browser';
import { Component, Pipe, PipeTransform, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Pipe({ name: 'stringifyEmployees', standalone: true })
export class StringifyEmployeesPipe implements PipeTransform {
  transform(employees: Employee[]) {
    return employees.map((employee) => `${employee.FirstName} ${employee.LastName}`).join(', ');
  }
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    StringifyEmployeesPipe,
  ],
})
export class AppComponent {
  employees: Employee[];

  prefix: string;

  prefixOptions: string[] = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

  selectedRows: number[] = [];

  selectionChangedBySelectBox: boolean;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  filterSelected(event) {
    this.selectionChangedBySelectBox = true;

    const prefix = event.value;

    if (!prefix) { return; }
    if (prefix === 'All') { this.selectedRows = this.employees.map((employee) => employee.ID); } else {
      this.selectedRows = this.employees.filter((employee) => employee.Prefix === prefix).map((employee) => employee.ID);
    }

    this.prefix = prefix;
  }

  selectionChangedHandler() {
    if (!this.selectionChangedBySelectBox) {
      this.prefix = null;
    }

    this.selectionChangedBySelectBox = false;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
