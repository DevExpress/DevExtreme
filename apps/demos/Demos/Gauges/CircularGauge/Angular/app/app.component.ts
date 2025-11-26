import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCircularGaugeModule, DxSelectBoxModule } from 'devextreme-angular';
import { Data, Service } from './app.service';

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
    DxCircularGaugeModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  dataSource: Data[];

  value: Data;

  constructor(service: Service) {
    this.dataSource = service.getData();
    this.value = this.dataSource[0];
  }

  customizeText(arg) {
    return `${arg.valueText} °C`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
