import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, ChangeDetectorRef, provideZoneChangeDetection } from '@angular/core';
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
  imports: [
    DxButtonModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
  ],
})

export class AppComponent {
  employee: Employee;

  employeeInfo = new Employee();

  loadingVisible = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, service: Service) {
    this.employee = service.getEmployee();
  }

  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);
  }

  onHidden() {
    this.employeeInfo = this.employee;
    this.changeDetectorRef.detectChanges();
  }

  showLoadPanel() {
    this.employeeInfo = new Employee();
    this.loadingVisible = true;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
