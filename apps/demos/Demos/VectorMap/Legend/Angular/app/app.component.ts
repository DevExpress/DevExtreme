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
  private readonly service = inject(Service);

  readonly worldMap = mapsData.world;

  readonly markers = this.service.getMarkers();

  private readonly populations: Object = this.service.getPopulations();

  customizeText({ index, start, end }) {
    if (index === 0) {
      return '< 0.5%';
    }

    return (index === 5)
      ? '> 3%'
      : `${start}% to ${end}%`;
  }

  readonly customizeTooltip = (arg: { attribute: Function }) => ({
    text: arg.attribute('text'),
  });

  readonly customizeItems = (items: unknown[]) => items.reverse();

  readonly customizeLayers = (elements: { attribute: Function }[]) => {
    elements.forEach((element) => {
      const name = element.attribute('name');
      const population = this.populations[name];
      if (population) {
        element.attribute('population', population);
      }
    });
  };

  readonly customizeMarkers = ({ index }) => ['< 8000K', '8000K to 10000K', '> 10000K'][index];
}

bootstrapApplication(AppComponent);
