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
  private readonly service = inject(Service);

  readonly worldMap = mapsData.world;

  readonly markers = this.service.getMarkers();

  private readonly populations = this.service.getPopulations();

  readonly customizeText: NonNullable<DxVectorMapTypes.Legend['customizeText']> = ({ index, start, end }) => {
    if (index === 0) {
      return '< 0.5%';
    }
    return (index === 5)
      ? '> 3%'
      : `${start}% to ${end}%`;
  };

  readonly customizeTooltip = (arg: DxVectorMapTypes.MapLayerElement): Record<string, unknown> => ({
    text: arg.attribute('text'),
  });

  readonly customizeItems = (items: DxVectorMapTypes.LegendItem[]): DxVectorMapTypes.LegendItem[] => items.reverse();

  readonly customizeLayers = (elements: DxVectorMapTypes.MapLayerElement[]): void => {
    elements.forEach((element) => {
      const name: string = element.attribute('name');
      const population = this.populations[name];
      if (population) {
        element.attribute('population', population);
      }
    });
  };

  readonly customizeMarkers = ({ index }: { index: number }): string => ['< 8000K', '8000K to 10000K', '> 10000K'][index];
}

bootstrapApplication(AppComponent);
