import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxLookupModule, DxLookupTypes } from 'devextreme-angular/ui/lookup';
import { Service, Employee } from './app.service';

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
    DxLookupModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  selectedEmployee: Employee;

  applyValueMode: DxLookupTypes.ApplyValueMode = 'instantly';

  applyValueModes: DxLookupTypes.ApplyValueMode[] = ['instantly', 'useButtons'];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  valueChanged({ value }: DxLookupTypes.ValueChangedEvent) {
    this.selectedEmployee = value;
  }

  getDisplayExpr = ({ FirstName, LastName }: Record<string, string> = {}) => (FirstName ? `${FirstName} ${LastName}` : undefined);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
