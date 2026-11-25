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

  private readonly populations = inject(Service).getPopulations();

  readonly customizeTooltip = ({ attribute }: DxVectorMapTypes.MapLayerElement): Record<string, unknown> => {
    if (attribute('population')) {
      return {
        text: `${attribute('name')}: ${attribute('population')}% of world population`,
      };
    }
    return {};
  };

  readonly customizeLayers = (elements: DxVectorMapTypes.MapLayerElement[]): void => {
    elements.forEach((element) => {
      element.attribute('population', this.populations[element.attribute('name')]);
    });
  };

  readonly customizeText: NonNullable<DxVectorMapTypes.Legend['customizeText']> = ({ index, start, end }) => {
    const text = (index === 0) ? '< 0.5%' : `${start}% to ${end}%`;
    return (index === 5) ? '> 3%' : text;
  };
}

bootstrapApplication(AppComponent);
