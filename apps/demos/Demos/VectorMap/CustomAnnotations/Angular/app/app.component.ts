import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/usa.js';
import { StatesCollection, Service } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxVectorMapModule,
    DecimalPipe,
  ],
})

export class AppComponent {
  usaMap = mapsData.usa;

  states: StatesCollection[];

  constructor(service: Service) {
    this.states = service.getStatesData();
  }

  getImagePath = (annotation: StatesCollection) => {
    const name = annotation.data.name.replace(/\s/, '');
    return `../../../../images/flags/${name}.svg`;
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
