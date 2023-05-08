import { NgModule, Component, enableProdMode } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule, DxPieChartModule } from 'devextreme-angular';

import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
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
  worldMap: any = mapsData.world;

  gdpData: Object;

  toolTipData: Object;

  pipe: any = new DecimalPipe('en-US');

  constructor(private service: Service) {
    this.gdpData = service.getCountriesGDP();
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      const countryGDPData = this.gdpData[element.attribute('name')];
      element.attribute('total', countryGDPData && countryGDPData.total || 0);
    });
  }

  customizeText = (arg) => `${this.pipe.transform(arg.start, '1.0-0')} to ${this.pipe.transform(arg.end, '1.0-0')}`;

  customizePieLabel(info) {
    return `${info.argument[0].toUpperCase()
        + info.argument.slice(1)
    }: $${info.value}M`;
  }

  getPieData(name): GdpInfo[] {
    return this.gdpData[name] ? [
      { name: 'industry', value: this.gdpData[name].industry },
      { name: 'services', value: this.gdpData[name].services },
      { name: 'agriculture', value: this.gdpData[name].agriculture },
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
