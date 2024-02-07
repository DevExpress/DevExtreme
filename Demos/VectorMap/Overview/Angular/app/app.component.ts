import { NgModule, Component, enableProdMode } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule, DxPieChartModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { GdpInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  worldMap = mapsData.world;

  gdpData: Object;

  pipe = new DecimalPipe('en-US');

  constructor(private service: Service) {
    this.gdpData = service.getCountriesGDP();
  }

  customizeLayers = (elements: Record<string, Function>[]) => {
    elements.forEach((element) => {
      const countryGDPData = this.gdpData[element.attribute('name')];
      element.attribute('total', countryGDPData && countryGDPData.total || 0);
    });
  };

  customizeText = ({ start, end }) => `${this.pipe.transform(start, '1.0-0')}`
      + ' to '
      + `${this.pipe.transform(end, '1.0-0')}`;

  customizePieLabel = ({ argument, value }) => `${argument[0].toUpperCase() + argument.slice(1)}: $${value}M`;

  getPieData(name: string): GdpInfo[] {
    const data = this.gdpData?.[name];

    return data ? [
      { name: 'industry', value: data.industry },
      { name: 'services', value: data.services },
      { name: 'agriculture', value: data.agriculture },
    ] : null;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxVectorMapModule,
    DxPieChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
