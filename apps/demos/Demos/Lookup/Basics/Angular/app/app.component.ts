import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxLookupModule } from 'devextreme-angular';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';

import { Service } from './app.service';

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
  ],
})
export class AppComponent {
  employees: string[];

  dataSource: DataSource;

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: new ArrayStore({
        data: service.getTasks(),
        key: 'Id',
      }),
      group: 'Assigned',
    });
    this.employees = service.getEmployees();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
