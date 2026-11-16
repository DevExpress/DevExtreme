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
    DecimalPipe,
  ],
})

export class AppComponent {
  readonly worldMap = mapsData.world;

  readonly gdpData: Object = inject(Service).getCountriesGDP();

  private readonly pipe = new DecimalPipe('en-US');

  readonly customizeLayers = (elements: Record<string, Function>[]) => {
    elements.forEach((element) => {
      const countryGDPData = this.gdpData[element.attribute('name')];
      element.attribute('total', countryGDPData?.total || 0);
    });
  };

  readonly customizeText = ({ start, end }: Record<string, number>) => `${this.pipe.transform(start, '1.0-0')} to ${this.pipe.transform(end, '1.0-0')}`;

  readonly customizePieLabel = ({ argument, value }: { argument: string[], value: unknown }) => `${argument[0].toUpperCase() + argument.slice(1)}: $${value}M`;

  getPieData(name: string): GdpInfo[] {
    return this.gdpData[name] ? [
      { name: 'industry', value: this.gdpData[name].industry },
      { name: 'services', value: this.gdpData[name].services },
      { name: 'agriculture', value: this.gdpData[name].agriculture },
    ] : null;
  }
}

bootstrapApplication(AppComponent);
