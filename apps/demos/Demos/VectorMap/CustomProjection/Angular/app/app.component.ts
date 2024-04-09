import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { FeatureCollection, Service } from './app.service';

const RADIANS = Math.PI / 180;
const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

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

  customProjection = {
    aspectRatio: 2,

    to(coordinates: number[]) {
      const x = coordinates[0] * RADIANS;
      const y = Math.min(Math.max(coordinates[1] * RADIANS, -WAGNER_6_P_LAT), +WAGNER_6_P_LAT);
      const t = y / Math.PI;
      return [
        x / Math.PI * Math.sqrt(1 - 3 * t * t),
        y * 2 / Math.PI,
      ];
    },

    from(coordinates: number[]) {
      const x = coordinates[0];
      const y = Math.min(Math.max(coordinates[1], -WAGNER_6_U_LAT), +WAGNER_6_U_LAT);
      const t = y / 2;
      return [
        x * Math.PI / Math.sqrt(1 - 3 * t * t) / RADIANS,
        y * Math.PI / 2 / RADIANS,
      ];
    },
  };

  coordLinesData: FeatureCollection;

  constructor(service: Service) {
    this.coordLinesData = service.getCoordLinesData();
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
