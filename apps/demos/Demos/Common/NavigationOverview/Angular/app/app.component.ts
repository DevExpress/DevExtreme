import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxTabPanelModule,
  DxTreeViewModule,
  DxTemplateModule,
} from 'devextreme-angular';

import {
  Continent, City, Country, Service,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTabPanelModule,
    DxTreeViewModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
