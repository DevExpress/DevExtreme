import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxVectorMapModule, DxPieChartModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import type { DxPieChartTypes } from 'devextreme-angular/ui/pie-chart';
import type { DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
import { Service } from './app.service';
import type { GdpInfo } from './app.service';

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
    DecimalPipe,
  ],
})

export class AppComponent {
  readonly worldMap = mapsData.world;

  readonly gdpData = inject(Service).getCountriesGDP();

  private readonly pipe = new DecimalPipe('en-US');

  readonly customizeLayers = (elements: DxVectorMapTypes.MapLayerElement[]): void => {
    elements.forEach((element) => {
      const countryGDPData = this.gdpData[element.attribute('name')];
      element.attribute('total', countryGDPData?.total || 0);
    });
  };

  readonly customizeText: NonNullable<DxVectorMapTypes.Legend['customizeText']> = ({ start, end }) => `${this.pipe.transform(start, '1.0-0')} to ${this.pipe.transform(end, '1.0-0')}`;

  readonly customizePieLabel = ({ argument, value }: DxPieChartTypes.PointInfo): string => {
    const name = String(argument);
    return `${name[0].toUpperCase() + name.slice(1)}: $${value}M`;
  };

  getPieData(name: string): GdpInfo[] | null {
    const data = this.gdpData[name];
    return data ? [
      { name: 'industry', value: data.industry },
      { name: 'services', value: data.services },
      { name: 'agriculture', value: data.agriculture },
    ] : null;
  }
}

bootstrapApplication(AppComponent);
