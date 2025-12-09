import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxTabPanelModule,
  DxTreeViewModule,
} from 'devextreme-angular';

import {
  Continent, City, Country, Service,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxTabPanelModule,
    DxTreeViewModule,
  ],
})

export class AppComponent {
  continents: Continent[];

  countryData: Country;

  citiesData: City[];

  tabPanelIndex: number;

  changeSelection(e) {
    const countryData = e.itemData;
    if (countryData.cities) {
      this.countryData = e.itemData;
      this.citiesData = countryData.cities;
      this.tabPanelIndex = 0;
    }
  }

  constructor(service: Service) {
    this.continents = service.getContinents();
    this.countryData = this.continents[0].items[0];
    this.citiesData = this.countryData.cities;
    this.tabPanelIndex = 0;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
