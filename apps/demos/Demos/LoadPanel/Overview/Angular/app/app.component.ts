import { NgModule, Component, enableProdMode, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, DxLoadPanelModule, DxCheckBoxModule } from 'devextreme-angular';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
})

export class AppComponent {
  employee: Employee;

  employeeInfo = new Employee();

  loadingVisible = false;

  // eslint-disable-next-line spellcheck/spell-checker
  constructor(private cdr: ChangeDetectorRef, service: Service) {
    this.employee = service.getEmployee();
  }

  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);
  }

  onHidden() {
    this.employeeInfo = this.employee;
    // eslint-disable-next-line spellcheck/spell-checker
    this.cdr.detectChanges();
  }

  showLoadPanel() {
    this.employeeInfo = new Employee();
    this.loadingVisible = true;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
