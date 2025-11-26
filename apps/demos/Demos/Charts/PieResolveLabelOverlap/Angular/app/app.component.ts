import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { MedalsInfo, Service } from './app.service';

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
  preserveWhitespaces: true,
  imports: [
    DxPieChartModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  olympicMedals: MedalsInfo[];

  resolveOverlappingTypes = ['shift', 'hide', 'none'];

  constructor(service: Service) {
    this.olympicMedals = service.getMedalsData();
  }

  customizeLabel(arg) {
    return `${arg.argumentText} (${arg.percentText})`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
