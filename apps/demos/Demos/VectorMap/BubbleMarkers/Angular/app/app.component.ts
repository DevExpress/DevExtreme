import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import type { DxVectorMapTypes } from 'devextreme-angular/ui/vector-map';
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

  readonly customizeText = ({ index }: { index: number }): string => ['< 8000K', '8000K to 10000K', '> 10000K'][index];

  readonly customizeItems = (items: DxVectorMapTypes.LegendItem[]): DxVectorMapTypes.LegendItem[] => items.reverse();

  readonly customizeTooltip = ({ layer, attribute }: DxVectorMapTypes.MapLayerElement): Record<string, unknown> => {
    if (layer.type === 'marker') {
      return {
        text: attribute('tooltip'),
      };
    }
    return {};
  };
}

bootstrapApplication(AppComponent);
