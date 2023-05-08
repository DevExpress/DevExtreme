import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule, DxDataGridModule } from 'devextreme-angular';

import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  employees: Employee[];

  selectedEmployees: Employee[];

  tableTitles: string[] = ['First Name', 'Last Name', 'Birth Year', 'City', 'Title'];

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.selectedEmployees = this.employees;
  }

  onValueChanged(e) {
    const selectedEmployees: any[] = [];

    this.employees.forEach((item, index) => {
      if (item.BirthYear >= e.value[0] && item.BirthYear <= e.value[1]) {
        selectedEmployees.push(item);
      }
    });

    this.selectedEmployees = selectedEmployees;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxRangeSelectorModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
