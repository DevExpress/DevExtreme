import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
import { MaleAgeStructure, Service } from './app.service';

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
    DxChartModule,
  ],
})
export class AppComponent {
  dataSource: MaleAgeStructure[];

  constructor(service: Service) {
    this.dataSource = service.getMaleAgeData();
  }

  customizeTooltip = ({ valueText, seriesName }) => ({
    text: `${seriesName} years: ${valueText}`,
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
