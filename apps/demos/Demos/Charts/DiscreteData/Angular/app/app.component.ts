import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPolarChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { Temperature, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxPolarChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  temperaturesData: Temperature[];

  types = ['scatter', 'line', 'area', 'bar', 'stackedbar'];

  constructor(service: Service) {
    this.temperaturesData = service.getTemperaturesData();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
