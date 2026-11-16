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

  private readonly populations: Object = inject(Service).getPopulations();

  customizeTooltip({ attribute }: { attribute: Function }) {
    if (attribute('population')) {
      return {
        text: `${attribute('name')}: ${attribute('population')}% of world population`,
      };
    }
    return null;
  }

  readonly customizeLayers = (elements: { attribute: Function }[]) => {
    elements.forEach((element) => {
      element.attribute('population', this.populations[element.attribute('name')]);
    });
  };

  customizeText({ index, start, end }: Record<string, number>) {
    const text = (index === 0) ? '< 0.5%' : `${start}% to ${end}%`;

    return (index === 5) ? '> 3%' : text;
  }
}

bootstrapApplication(AppComponent);
