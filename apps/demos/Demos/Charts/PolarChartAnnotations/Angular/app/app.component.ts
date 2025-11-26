import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPolarChartModule } from 'devextreme-angular';
import { Temperature, Service } from './app.service';

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
    DxPolarChartModule,
  ],
})
export class AppComponent {
  temperaturesData: Temperature[];

  maxDay: Temperature;

  minNight: Temperature;

  constructor(service: Service) {
    this.temperaturesData = service.getTemperaturesData();
    this.maxDay = this.temperaturesData.reduce((prev, current) => (prev.day >= current.day ? prev : current));
    this.minNight = this.temperaturesData.reduce((prev, current) => (prev.night <= current.night ? prev : current));
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
