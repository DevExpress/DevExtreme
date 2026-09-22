import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';
import { PercentPipe } from '@angular/common';
import { PopulationByRegion, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxPieChartModule,
  ],
})

export class AppComponent {
  pipe = new PercentPipe('en-US');

  populationByRegions: PopulationByRegion[];

  constructor(service: Service) {
    this.populationByRegions = service.getPopulationByRegions();
  }

  customizeTooltip = ({ valueText, percent }: { valueText: string, percent: number }) => ({
    text: `${valueText} - ${this.pipe.transform(percent, '1.2-2')}`,
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
