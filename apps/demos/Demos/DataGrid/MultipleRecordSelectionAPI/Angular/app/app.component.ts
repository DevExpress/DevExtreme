import {
  NgModule, Component, Pipe, PipeTransform, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule, DxButtonModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  employees: Employee[];

  prefix: string;

  prefixOptions: string[] = ['All', 'Dr.', 'Mr.', 'Mrs.', 'Ms.'];

  selectedRows: number[] = [];

  selectionChangedBySelectbox: boolean;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  filterSelected(event) {
    this.selectionChangedBySelectbox = true;

    const prefix = event.value;

    if (!prefix) { return; }
    if (prefix === 'All') { this.selectedRows = this.employees.map((employee) => employee.ID); } else {
      this.selectedRows = this.employees.filter((employe) => employe.Prefix === prefix).map((employee) => employee.ID);
    }

    this.prefix = prefix;
  }

  selectionChangedHandler() {
    if (!this.selectionChangedBySelectbox) {
      this.prefix = null;
    }

    this.selectionChangedBySelectbox = false;
  }
}

@Pipe({ name: 'stringifyEmployees' })
export class StringifyEmployeesPipe implements PipeTransform {
  transform(employees: Employee[]) {
    return employees.map((employee) => `${employee.FirstName} ${employee.LastName}`).join(', ');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent, StringifyEmployeesPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
