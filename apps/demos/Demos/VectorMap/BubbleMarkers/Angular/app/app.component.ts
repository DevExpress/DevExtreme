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
  worldMap = mapsData.world;

  markers: FeatureCollection;

  constructor(service: Service) {
    this.markers = service.getMarkers();
  }

  customizeText = ({ index }) => ['< 8000K', '8000K to 10000K', '> 10000K'][index];

  customizeItems = (items: unknown[]) => items.reverse();

  customizeTooltip({ layer: { type }, attribute }) {
    if (type === 'marker') {
      return {
        text: attribute('tooltip'),
      };
    }
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
