import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Population, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  populationData: Population[];

  constructor(service: Service) {
    this.populationData = service.getPopulationData();
  }

  customizeTooltip = ({ valueText }: DxChartTypes.CommonPointInfo) => ({
    text: Math.abs(Number(valueText)),
  });

  customizeLabel: DxChartTypes.ValueAxisLabel['customizeText'] = ({ value }) => `${Math.abs(value as number)}%`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
