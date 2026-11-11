import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxVectorMapModule, DxPieChartModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { type GdpInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxVectorMapModule,
    DxPieChartModule,
  ],
})

export class AppComponent {
  readonly worldMap = mapsData.world;

  readonly gdpData: Object = inject(Service).getCountriesGDP();

  readonly pipe = new DecimalPipe('en-US');

  readonly customizeLayers = (elements: Record<string, Function>[]) => {
    elements.forEach((element) => {
      const countryGDPData = this.gdpData[element.attribute('name')];
      element.attribute('total', countryGDPData?.total || 0);
    });
  };

  readonly customizeText = ({ start, end }) => `${this.pipe.transform(start, '1.0-0')}`
      + ' to '
      + `${this.pipe.transform(end, '1.0-0')}`;

  readonly customizePieLabel = ({ argument, value }) => `${argument[0].toUpperCase() + argument.slice(1)}: $${value}M`;

  getPieData(name: string): GdpInfo[] {
    const data = this.gdpData?.[name];

    return data ? [
      { name: 'industry', value: data.industry },
      { name: 'services', value: data.services },
      { name: 'agriculture', value: data.agriculture },
    ] : null;
  }
}

bootstrapApplication(AppComponent);
