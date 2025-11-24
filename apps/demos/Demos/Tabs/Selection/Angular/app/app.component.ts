import { Component, enableProdMode, provideZoneChangeDetection} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxTabsModule, DxSelectBoxModule, DxMultiViewModule } from 'devextreme-angular';
import { Tab, Service } from './app.service';

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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxTabsModule,
    DxMultiViewModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  employees: Tab[];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
