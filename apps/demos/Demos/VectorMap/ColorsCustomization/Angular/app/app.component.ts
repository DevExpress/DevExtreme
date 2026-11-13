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

  private readonly countries = inject(Service).getCountries();

  readonly customizeTooltip = ({ attribute }) => {
    const name = attribute('name');
    const country = this.countries[name];
    if (country) {
      return {
        text: `${name}: ${country.totalArea}M km&#178`,
        color: country.color,
      };
    }
    return null;
  };

  readonly customizeLayers = (elements: { attribute: Function, applySettings: Function }[]) => {
    elements.forEach((element) => {
      const country = this.countries[element.attribute('name')];
      if (country) {
        element.applySettings({
          color: country.color,
          hoveredColor: '#e0e000',
          selectedColor: '#008f00',
        });
      }
    });
  };

  readonly click = ({ target }: DxVectorMapTypes.ClickEvent) => {
    if (target && this.countries[target.attribute('name')]) {
      target.selected(!target.selected());
    }
  };
}

bootstrapApplication(AppComponent);
