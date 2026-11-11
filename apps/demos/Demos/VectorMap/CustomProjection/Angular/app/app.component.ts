import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { Service } from './app.service';

const RADIANS = Math.PI / 180;
const WAGNER_6_P_LAT = Math.PI / Math.sqrt(3);
const WAGNER_6_U_LAT = 2 / Math.sqrt(3) - 0.1;

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
  ],
})

export class AppComponent {
  readonly worldMap = mapsData.world;

  readonly customProjection = {
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

  readonly coordLinesData = inject(Service).getCoordLinesData();
}

bootstrapApplication(AppComponent);
