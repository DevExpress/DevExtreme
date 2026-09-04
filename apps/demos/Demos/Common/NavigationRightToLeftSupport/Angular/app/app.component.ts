import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxAccordionModule,
  DxSelectBoxModule,
  DxMenuModule,
  DxTreeViewModule,
} from 'devextreme-angular';

import { Continent, EuropeCountry, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxAccordionModule,
    DxSelectBoxModule,
    DxMenuModule,
    DxTreeViewModule,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
