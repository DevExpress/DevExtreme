import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';

import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { FeatureCollection, Service } from './app.service';

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

  markers: FeatureCollection;

  populations: Object;

  constructor(service: Service) {
    this.markers = service.getMarkers();
    this.populations = service.getPopulations();
    this.customizeLayers = this.customizeLayers.bind(this);
  }

  customizeText(arg) {
    if (arg.index === 0) {
      return '< 0.5%';
    } if (arg.index === 5) {
      return '> 3%';
    }
    return `${arg.start}% to ${arg.end}%`;
  }

  customizeTooltip(arg) {
    return {
      text: arg.attribute('text'),
    };
  }

  customizeItems(items) {
    return items.reverse();
  }

  customizeLayers(elements) {
    elements.forEach((element) => {
      const name = element.attribute('name');
      const population = this.populations[name];
      if (population) {
        element.attribute('population', population);
      }
    });
  }

  customizeMarkers(arg) {
    return ['< 8000K', '8000K to 10000K', '> 10000K'][arg.index];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxVectorMapModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
