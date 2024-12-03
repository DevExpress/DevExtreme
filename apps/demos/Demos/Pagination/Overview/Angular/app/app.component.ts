import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPaginationModule } from 'devextreme-angular';
import { Employee, Service } from './app.service';
import { EmployeeCard } from './employee-card/employee-card.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];

  pageEmployees: Employee[];

  itemCount: number;

  readonly allowedPageSizes = [4, 6];

  showInfo = true;

  showNavigationButtons = true;

  pageIndex = 1;
  
  pageSize = 4;

  onPageIndexChange(val) {
    this.pageIndex = val;
    this.setPageEmployees();
  }

  onPageSizeChange(val) {
    this.pageSize = val;
    this.setPageEmployees();
  }

  setPageEmployees() {
    this.pageEmployees = this.employees.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
  }

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.itemCount = this.employees.length;
    this.setPageEmployees();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPaginationModule,
  ],
  declarations: [AppComponent, EmployeeCard],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
