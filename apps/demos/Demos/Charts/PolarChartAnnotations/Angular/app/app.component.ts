import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxPolarChartModule } from 'devextreme-angular';

import { Temperature, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
