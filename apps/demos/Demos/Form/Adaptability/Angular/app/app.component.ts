import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxFormModule } from 'devextreme-angular';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
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
  imports: [
    DxCheckBoxModule,
    DxFormModule,
  ],
})
export class AppComponent {
  employee: Employee;

  colCountByScreen = {
    md: 4,
    sm: 2,
  };

  constructor(service: Service) {
    this.employee = service.getEmployee();
  }

  screen = (width: number) => (width < 720 ? 'sm' : 'md');

  valueChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    if (e.value) {
      this.colCountByScreen = null;
    } else {
      this.colCountByScreen = {
        md: 4,
        sm: 2,
      };
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
