import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxAccordionModule,
  DxSelectBoxModule,
  DxMenuModule,
  DxTreeViewModule,
  DxTemplateModule,
} from 'devextreme-angular';

import { Continent, EuropeCountry, Service } from './app.service';

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

  europeCountries: EuropeCountry[];

  languages: string[] = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];

  rtlEnabled = false;

  constructor(service: Service) {
    this.continents = service.getContinents();
    this.europeCountries = service.getEuropeCountries();
  }

  selectLanguage(e) {
    this.rtlEnabled = e.value === this.languages[0];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxAccordionModule,
    DxSelectBoxModule,
    DxMenuModule,
    DxTreeViewModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
