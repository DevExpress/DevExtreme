import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

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

@NgModule({
  imports: [
    BrowserModule,
    DxPolarChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
