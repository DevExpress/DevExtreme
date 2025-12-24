import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';
import { DecimalPipe } from '@angular/common';
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
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxPieChartModule,
  ],
})

export class AppComponent {
  service: Service;

  countries: Iterable<string>;

  pipe = new DecimalPipe('en-US');

  constructor(service: Service) {
    this.service = service;
    this.countries = new Set(service.getData().map((item) => item.country));
  }

  customizeLabel(e) {
    return `${e.argumentText}\n${e.valueText}`;
  }

  calculateTotal(pieChart) {
    const totalValue = pieChart.getAllSeries()[0].getVisiblePoints().reduce((s, p) => s + p.originalValue, 0);
    return this.pipe.transform(totalValue, '1.0-0');
  }

  getImagePath(country) {
    return `../../../../images/flags/${country.replace(/\s/, '').toLowerCase()}.svg`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
