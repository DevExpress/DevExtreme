import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { CountryInfo, EnergyDescription, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxChartModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  types: string[] = ['line', 'stackedline', 'fullstackedline'];

  countriesInfo: CountryInfo[];

  energySources: EnergyDescription[];

  constructor(service: Service) {
    this.countriesInfo = service.getCountriesInfo();
    this.energySources = service.getEnergySources();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
