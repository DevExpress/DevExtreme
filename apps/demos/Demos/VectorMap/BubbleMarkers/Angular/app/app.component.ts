import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { Service } from './app.service';

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

  readonly markers = inject(Service).getMarkers();

  readonly customizeText = ({ index }) => ['< 8000K', '8000K to 10000K', '> 10000K'][index];

  readonly customizeItems = (items: unknown[]) => items.reverse();

  customizeTooltip({ layer: { type }, attribute }) {
    if (type === 'marker') {
      return {
        text: attribute('tooltip'),
      };
    }
    return null;
  }
}

bootstrapApplication(AppComponent);
